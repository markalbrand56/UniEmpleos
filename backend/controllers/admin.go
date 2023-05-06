package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
)

type AdministradorInput struct {
	IdAdministrador string `json:"id_administrador"`
	Nombre          string `json:"nombre"`
	Apellido        string `json:"apellido"`
}

func NewAdmin(c *gin.Context) {
	var input AdministradorInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error binding JSON: " + err.Error(),
			Data:    nil,
		})
		return
	}

	a := models.Administrador{
		IdAdministrador: input.IdAdministrador,
		Nombre:          input.Nombre,
		Apellido:        input.Apellido,
	}

	err := configs.DB.Create(&a).Error // Se agrega el administrador a la base de datos

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error creating",
			Data:    nil,
		})
		return
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Admin Created Successfully",
		Data:    nil,
	})
}
