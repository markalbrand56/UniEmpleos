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
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Invalid credentials: " + err.Error(),
			Data:    nil,
		})
		return
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Login successful",
		Data:    map[string]interface{}{"token": token},
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

	token, err := utils.GenerateToken(found.Usuario)

	if err != nil {
		return "", err
	}

	return token, nil
}

func CurrentUser(c *gin.Context) {

	username, err := utils.ExtractTokenUsername(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	u, err := models.GetUserByUsername(username)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  200,
		Message: "User found",
		Data: map[string]interface{}{
			"usuario":    u.Usuario,
			"suspendido": u.Suspendido,
		},
	})
}
