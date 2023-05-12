package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
)

type CarrerInput struct {
	Nombre      string `json:"nombre"`
	Descripcion string `json:"descripcion"`
}

func NewCarrer(c *gin.Context) {
	var input CarrerInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	carrera := models.Carrera{
		Nombre:      input.Nombre,
		Descripcion: input.Descripcion,
	}

	err := configs.DB.Create(&carrera).Error

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
		Message: "Carrera created successfully",
		Data:    nil,
	})

}
