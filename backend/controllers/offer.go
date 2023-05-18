package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
)

type OffertInput struct {
	IDempresa   string `json:"id_empresa"`
	Puesto      string `json:"puesto"`
	Descripcion string `json:"descripcion"`
	Requisitos  string `json:"requisitos"`
	Salario     string `json:"salario"`
}

func NewOffer(c *gin.Context) {
	var input OffertInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	offert := models.Oferta{
		IDempresa:   input.IDempresa,
		Puesto:      input.Puesto,
		Descripcion: input.Descripcion,
		Requisitos:  input.Requisitos,
		Salario:     input.Salario,
	}

	err := configs.DB.Create(&offert).Error

	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Offer created successfully",
		Data:    nil,
	})

}
