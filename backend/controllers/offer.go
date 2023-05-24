package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
)

type OfferInput struct {
	IDEmpresa   string  `json:"id_empresa"`
	Puesto      string  `json:"puesto"`
	Descripcion string  `json:"descripcion"`
	Requisitos  string  `json:"requisitos"`
	Salario     float64 `json:"salario"`
	IDOferta    int     `json:"id_oferta"`
	IDCarrera   []int   `json:"id_carrera"`
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
	// Nuevo código: consulta para obtener el ID de la oferta que acabamos de crear.
	var ofertaCreada models.Oferta
	result := configs.DB.Where(&models.Oferta{
		IDEmpresa:   offer.IDEmpresa,
		Puesto:      offer.Puesto,
		Descripcion: offer.Descripcion,
		Requisitos:  offer.Requisitos,
		Salario:     offer.Salario,
	}).First(&ofertaCreada)

	if result.Error != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error retrieving created offer: " + result.Error.Error(),
			Data:    nil,
		})
		return
	}

	for _, carreraId := range input.IDCarrera {
		oc := models.OfertaCarrera{
			IdOferta:  ofertaCreada., // Usar el ID de la oferta obtenida
			IdCarrera: carreraId,
		}

		err := configs.DB.Create(&oc).Error
		if err != nil {
			c.JSON(400, responses.StandardResponse{
				Status:  400,
				Message: "Error creating offer: " + err.Error(),
				Data:    nil,
			})
			return
		}
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Offer created successfully",
		Data:    nil,
	})
}
