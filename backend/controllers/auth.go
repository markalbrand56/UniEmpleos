package controllers

import (
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
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
