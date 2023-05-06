package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
)

type CarrerInput struct {
	IdCarrera   string `json:"id_carrera"`
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
		IdCarrera:   input.IdCarrera,
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

}
