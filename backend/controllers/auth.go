package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"backend/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

type RegisterInput struct {
	Usuario string `json:"usuario"`
	Contra  string `json:"contra"`
}

func Register(c *gin.Context) {
	var input RegisterInput

	// En esta línea se hace el binding del JSON que viene en el body del request a la variable input
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{Status: 400, Message: "Invalid input", Data: nil})
		return
	}

	u := models.Usuario{
		Usuario:    input.Usuario,
		Contra:     input.Contra,
		Suspendido: false,
	}

	_, err := u.SaveUser()

	if err != nil {
		c.JSON(400, responses.StandardResponse{Status: 400, Message: "Error creating user", Data: nil})
		return
	}

	c.JSON(200, responses.StandardResponse{Status: 200, Message: "Usuario created successfully", Data: nil})
}

type LoginInput struct {
	Usuario string `json:"usuario"`
	Contra  string `json:"contra"`
}

func Login(c *gin.Context) {
	var input LoginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{Status: 400, Message: "Invalid input", Data: nil})
		return
	}

	u := models.Usuario{
		Usuario: input.Usuario,
		Contra:  input.Contra,
	}

	token, err := verifyLogin(u)

	if err != nil {
		c.JSON(http.StatusUnauthorized, responses.StandardResponse{
			Status:  401,
			Message: "Invalid credentials: " + err.Error(),
			Data:    nil,
		})
		return
	}

	role, err := RoleFromUser(u)

	if err != nil {
		c.JSON(http.StatusNotFound, responses.StandardResponse{
			Status:  404,
			Message: "Invalid credentials",
			Data:    nil,
		})
		return
	}

	suspended, err := verifySuspended(u)

	if err != nil {
		c.JSON(http.StatusNotFound, responses.StandardResponse{
			Status:  404,
			Message: "Could not verify account status: " + err.Error(),
			Data:    nil,
		})
		return
	}

	if suspended {
		c.JSON(http.StatusForbidden, responses.StandardResponse{
			Status:  403,
			Message: "Account is suspended",
			Data:    nil,
		})
		return
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Login successful",
		Data: map[string]interface{}{
			"token": token,
			"role":  role,
		},
	})
}

func verifyLogin(usuario models.Usuario) (string, error) {
	var err error

	found := models.Usuario{}
	err = configs.DB.Where("usuario = ?", usuario.Usuario).First(&found).Error

	if err != nil {
		return "", err
	}

	err = bcrypt.CompareHashAndPassword([]byte(found.Contra), []byte(usuario.Contra))

	if err != nil {
		return "", err
	}

	role, err := RoleFromUser(found)

	token, err := utils.GenerateToken(found.Usuario, role)

	if err != nil {
		return "", err
	}

	return token, nil
}

func verifySuspended(usuario models.Usuario) (bool, error) {
	var err error

	found := models.Usuario{}
	err = configs.DB.Where("usuario = ?", usuario.Usuario).First(&found).Error

	if err != nil {
		return false, err
	}

	return found.Suspendido, nil
}

func RoleFromUser(usuario models.Usuario) (string, error) {
	var err error
	var role string

	student := models.Estudiante{}
	err = configs.DB.Where("id_estudiante = ?", usuario.Usuario).First(&student).Error
	if err == nil {
		role = "student"
		return role, nil
	}

	enterprise := models.Empresa{}
	err = configs.DB.Where("id_empresa = ?", usuario.Usuario).First(&enterprise).Error
	if err == nil {
		role = "enterprise"
		return role, nil
	}

	admin := models.Administrador{}
	err = configs.DB.Where("id_admin = ?", usuario.Usuario).First(&admin).Error
	if err == nil {
		role = "admin"
		return role, nil
	}

	return "", err

}

func RoleFromToken(c *gin.Context) (string, error) {
	username, err := utils.ExtractTokenUsername(c)

	if err != nil {
		return "", err
	}

	u, err := models.GetUserByUsername(username)

	if err != nil {
		return "", err
	}

	role, err := RoleFromUser(u)

	if err != nil {
		return "", err
	}

	return role, nil
}

func CurrentUser(c *gin.Context) {
	username, err := utils.ExtractTokenUsername(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  400,
			Message: "Invalid token. +" + err.Error(),
			Data:    nil,
		})
		return
	}

	u, err := models.GetUserByUsername(username)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  400,
			Message: "User not found. +" + err.Error(),
			Data:    nil,
		})
		return
	}

	var estudiante models.Estudiante
	var empresa models.Empresa
	var administrador models.Administrador

	err = configs.DB.Where("id_estudiante = ?", u.Usuario).First(&estudiante).Error
	if err == nil {
		c.JSON(http.StatusOK, responses.StandardResponse{
			Status:  200,
			Message: "User found",
			Data: map[string]interface{}{
				"usuario":    estudiante,
				"suspendido": u.Suspendido,
			},
		})
		return
	}

	err = configs.DB.Where("id_empresa = ?", u.Usuario).First(&empresa).Error

	if err == nil {
		c.JSON(http.StatusOK, responses.StandardResponse{
			Status:  200,
			Message: "User found",
			Data: map[string]interface{}{
				"usuario":    empresa,
				"suspendido": u.Suspendido,
			},
		})
		return
	}

	err = configs.DB.Where("id_admin = ?", u.Usuario).First(&administrador).Error

	if err == nil {
		c.JSON(http.StatusOK, responses.StandardResponse{
			Status:  200,
			Message: "User found",
			Data: map[string]interface{}{
				"usuario":    administrador,
				"suspendido": u.Suspendido,
			},
		})
		return
	}

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  400,
			Message: "User not found",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  400,
		Message: "User not found",
		Data:    nil,
	},
	)
}

type UserDetailsInput struct {
	Correo string `json:"correo"`
}

func GetUserDetails(c *gin.Context) {
	var input UserDetailsInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{Status: 400, Message: "Invalid input", Data: nil})
		return
	}

	var estudiante models.Estudiante
	var empresa models.Empresa
	var administrador models.Administrador

	err := configs.DB.Where("correo = ?", input.Correo).First(&estudiante).Error
	if err == nil {
		c.JSON(http.StatusOK, responses.StandardResponse{
			Status:  200,
			Message: "User found",
			Data: map[string]interface{}{
				"estudiante": estudiante,
			},
		})
		return
	}

	err = configs.DB.Where("correo = ?", input.Correo).First(&empresa).Error

	if err == nil {
		c.JSON(http.StatusOK, responses.StandardResponse{
			Status:  200,
			Message: "User found",
			Data: map[string]interface{}{
				"empresa": empresa,
			},
		})
		return
	}

	err = configs.DB.Where("correo = ?", input.Correo).First(&administrador).Error

	if err == nil {
		c.JSON(http.StatusUnauthorized, responses.StandardResponse{
			Status:  401,
			Message: "Access denied",
			Data:    nil,
		})
		return
	}

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  400,
			Message: "User not found. " + err.Error(),
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  400,
		Message: "User not found",
		Data:    nil,
	},
	)
}
