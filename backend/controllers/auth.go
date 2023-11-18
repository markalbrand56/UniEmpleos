package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"backend/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"time"
)

// Input para login
type LoginInput struct {
	Usuario string `json:"usuario"`
	Contra  string `json:"contra"`
}

// Funcion para hacer login
func Login(c *gin.Context) {
	var input LoginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid input. " + err.Error(),
			Data:    nil,
		})
		return
	}

	u := models.Usuario{
		Usuario: input.Usuario,
		Contra:  input.Contra,
	}

	// Verificar token de login
	token, err := verifyLogin(u)

	if err != nil {
		c.JSON(http.StatusUnauthorized, responses.StandardResponse{
			Status:  http.StatusUnauthorized,
			Message: "Invalid credentials",
			Data:    nil,
		})
		return
	}

	// Verificar rol del usuario
	role, err := RoleFromUser(u)

	if err != nil {
		c.JSON(http.StatusNotFound, responses.StandardResponse{
			Status:  404,
			Message: "Could not verify role: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Verificar si el usuario esta suspendido
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

// Funcion para verificar el login
func verifyLogin(usuario models.Usuario) (string, error) {
	var err error

	found := models.Usuario{}

	// Buscar usuario en la base de datos
	err = configs.DB.Where("usuario = ?", usuario.Usuario).First(&found).Error

	if err != nil {
		return "", err
	}

	// Comparar contrasenas encriptada y sin encriptar
	err = bcrypt.CompareHashAndPassword([]byte(found.Contra), []byte(usuario.Contra))

	if err != nil {
		return "", err
	}

	// Buscar rol del usuario
	role, err := RoleFromUser(found)

	// Generar token
	token, err := utils.GenerateToken(found.Usuario, role)

	if err != nil {
		return "", err
	}

	return token, nil
}

// Funcion para verificar si el usuario esta suspendido
func verifySuspended(usuario models.Usuario) (bool, error) {
	var err error

	found := models.Usuario{}

	// Buscar usuario en la base de datos
	err = configs.DB.Where("usuario = ?", usuario.Usuario).First(&found).Error

	if err != nil {
		return false, err
	}

	return found.Suspendido, nil
}

// Funcion para buscar el rol del usuario
func RoleFromUser(usuario models.Usuario) (string, error) {
	var err error
	var role string

	student := models.Estudiante{}

	// Buscar si es estudiante
	err = configs.DB.Where("id_estudiante = ?", usuario.Usuario).First(&student).Error
	if err == nil {
		role = "student"
		return role, nil
	}

	enterprise := models.Empresa{}

	// Buscar si es empresa
	err = configs.DB.Where("id_empresa = ?", usuario.Usuario).First(&enterprise).Error
	if err == nil {
		role = "enterprise"
		return role, nil
	}

	admin := models.Administrador{}

	// Buscar si es administrador
	err = configs.DB.Where("id_admin = ?", usuario.Usuario).First(&admin).Error
	if err == nil {
		role = "admin"
		return role, nil
	}

	return "", err

}

func RoleFromToken(c *gin.Context) (string, error) {
	username, err := utils.TokenExtractUsername(c)

	if err != nil {
		return "", err
	}

	role, err := RoleFromUser(models.Usuario{Usuario: username})

	if err != nil {
		return "", err
	}

	return role, nil
}

// Funcion para ver los detalles del usuario
func GetCurrentUserDetails(c *gin.Context) {
	username, err := utils.TokenExtractUsername(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  400,
			Message: "Invalid token. +" + err.Error(),
			Data:    nil,
		})
		return
	}

	// Buscar usuario en la base de datos
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

	// Buscar si es estudiante
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

	// Buscar si es empresa
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

	// Buscar si es administrador
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

// Input para GetUserDetails (estudiante)
type PublicDetailsStudent struct {
	Correo      string    `json:"correo"`
	Nombre      string    `json:"nombre"`
	Apellido    string    `json:"apellido"`
	Nacimiento  time.Time `json:"nacimiento"`
	Telefono    string    `json:"telefono"`
	Carrera     int       `json:"carrera"`
	Semestre    int       `json:"semestre"`
	CV          string    `json:"cv"`
	Foto        string    `json:"foto"`
	Universidad string    `json:"universidad"`
}

// Input para GetUserDetails (empresa)
type PublicDetailsEnterprise struct {
	Correo   string `json:"correo"`
	Nombre   string `json:"nombre"`
	Foto     string `json:"foto"`
	Detalles string `json:"detalles"`
}

// Input para GetUserDetails
type UserDetailsInput struct {
	Correo string `json:"correo"`
}

func GetUserDetails(c *gin.Context) {
	var input UserDetailsInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid input. " + err.Error(),
			Data:    nil,
		})
		return
	}

	var estudiante models.Estudiante
	var empresa models.Empresa

	// Buscar rol del usuario
	userType, err := RoleFromUser(models.Usuario{Usuario: input.Correo})

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "User not found. " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Buscar detalles del usuario
	switch userType {
	case "student":
		// Buscar estudiante
		err = configs.DB.Where("id_estudiante = ?", input.Correo).First(&estudiante).Error
		if err != nil {
			c.JSON(http.StatusBadRequest, responses.StandardResponse{
				Status:  http.StatusBadRequest,
				Message: "Student not found. " + err.Error(),
				Data:    nil,
			})
			return
		}

		c.JSON(http.StatusOK, responses.StandardResponse{
			Status:  http.StatusOK,
			Message: "Student found",
			Data: map[string]interface{}{
				"student": PublicDetailsStudent{
					Correo:      estudiante.Correo,
					Nombre:      estudiante.Nombre,
					Apellido:    estudiante.Apellido,
					Nacimiento:  estudiante.Nacimiento,
					Telefono:    estudiante.Telefono,
					Carrera:     estudiante.Carrera,
					Semestre:    estudiante.Semestre,
					CV:          estudiante.CV,
					Foto:        estudiante.Foto,
					Universidad: estudiante.Universidad,
				},
			},
		})
	case "enterprise":
		// Buscar empresa
		err = configs.DB.Where("id_empresa = ?", input.Correo).First(&empresa).Error
		if err != nil {
			c.JSON(http.StatusBadRequest, responses.StandardResponse{
				Status:  http.StatusBadRequest,
				Message: "Enterprise not found. " + err.Error(),
				Data:    nil,
			})
			return
		}

		c.JSON(http.StatusOK, responses.StandardResponse{
			Status:  http.StatusOK,
			Message: "Enterprise found",
			Data: map[string]interface{}{
				"company": PublicDetailsEnterprise{
					Correo:   empresa.Correo,
					Nombre:   empresa.Nombre,
					Foto:     empresa.Foto,
					Detalles: empresa.Detalles,
				},
			},
		})
	case "admin": // Admins cannot be viewed
		c.JSON(http.StatusForbidden, responses.StandardResponse{
			Status:  http.StatusForbidden,
			Message: "Admins cannot be viewed",
			Data:    nil,
		})
	default:
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "User not found. " + err.Error(),
			Data:    nil,
		})
	}
}
