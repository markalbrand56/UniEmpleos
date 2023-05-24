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

type OfferGet struct {
	Id_Oferta string `json:"id_oferta"`
}

func GetOffer(c *gin.Context) {
	var offer models.OfertaGet
	var Company models.Empresa
	var data map[string]interface{}
	var input OfferGet

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Invalid input: " + err.Error(),
			Data:    nil,
		})
		return
	}

	err := configs.DB.Where("id_oferta = ?", input.Id_Oferta).First(&offer).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error getting offer: " + err.Error(),
			Data:    nil,
		})
		return
	}

	err = configs.DB.Where("id_empresa = ?", offer.IDEmpresa).First(&Company).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error getting company: " + err.Error(),
			Data:    nil,
		})
		return
	}

	data = map[string]interface{}{
		"offer":   offer,
		"company": Company,
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Offer retrieved successfully",
		Data:    data,
	})
}

type GetOfferByCompanyInput struct {
	Id_Empresa string `json:"id_empresa"`
}

func GetOfferByCompany(c *gin.Context) {
	var offers []models.OfertaGet
	var data map[string]interface{}
	var input GetOfferByCompanyInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Invalid input: " + err.Error(),
			Data:    nil,
		})
		return
	}

	err := configs.DB.Where("id_empresa = ?", input.Id_Empresa).Find(&offers).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error getting offers: " + err.Error(),
			Data:    nil,
		})
		return
	}

	data = map[string]interface{}{
		"offers": offers,
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Offers retrieved successfully",
		Data:    data,
	})
}
