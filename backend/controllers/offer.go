package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"fmt"
	"github.com/gin-gonic/gin"
)

type OfferInput struct {
	IDEmpresa   string  `json:"id_empresa"`
	Puesto      string  `json:"puesto"`
	Descripcion string  `json:"descripcion"`
	Requisitos  string  `json:"requisitos"`
	Salario     float64 `json:"salario"`
}

func NewOffer(c *gin.Context) {
	var input OfferInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Invalid input: " + err.Error(),
			Data:    nil,
		})
		return
	}

	offer := models.Oferta{
		IDEmpresa:   input.IDEmpresa,
		Puesto:      input.Puesto,
		Descripcion: input.Descripcion,
		Requisitos:  input.Requisitos,
		Salario:     input.Salario,
	}

	fmt.Println(offer)

	err := configs.DB.Create(&offer).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error creating offer: " + err.Error(),
			Data:    nil,
		})
		return
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Offer created successfully",
		Data:    nil,
	})

}
