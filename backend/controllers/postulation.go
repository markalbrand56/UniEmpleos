package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
)

type PostulationInput struct {
	IdOferta     int    `json:"id_oferta"`
	IdEstudiante string `json:"id_estudiante"`
	Estado       string `json:"estado"`
}

func NewPostulation(c *gin.Context) {
	var input PostulationInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	postulation := models.Postulacion{
		IdOferta:     input.IdOferta,
		IdEstudiante: input.IdEstudiante,
		Estado:       input.Estado,
	}

	err := configs.DB.Create(&postulation).Error

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
		Message: "Postulation created successfully",
		Data:    nil,
	})
}
