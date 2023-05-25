package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"fmt"
	"github.com/gin-gonic/gin"
)

type OfferInput struct {
	IDEmpresa   string   `json:"id_empresa"`
	Puesto      string   `json:"puesto"`
	Descripcion string   `json:"descripcion"`
	Requisitos  string   `json:"requisitos"`
	Salario     float64  `json:"salario"`
	IdCarreras  []string `json:"id_carreras"`
}

type AfterInsert struct {
	IdOferta    int     `json:"id_oferta"`
	IDEmpresa   string  `json:"id_empresa"`
	Puesto      string  `json:"puesto"`
	Descripcion string  `json:"descripcion"`
	Requisitos  string  `json:"requisitos"`
	Salario     float64 `json:"salario"`
}

type AfterInsert2 struct {
	IdOferta  int `json:"id_oferta"`
	IdCarrera int `json:"id_carrera"`
}

func NewOffer(c *gin.Context) {
	var input OfferInput

	if err := c.BindJSON(&input); err != nil {
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

	var inserted AfterInsert
	err := configs.DB.Raw("INSERT INTO oferta (id_empresa, puesto, descripcion, requisitos, salario) VALUES (?, ?, ?, ?, ?) RETURNING id_oferta, id_empresa, puesto, descripcion, requisitos, salario", offer.IDEmpresa, offer.Puesto, offer.Descripcion, offer.Requisitos, offer.Salario).Scan(&inserted).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error creating offer: " + err.Error(),
			Data:    nil,
		})
		return
	}

	fmt.Println("\ncarreras: ", input.IdCarreras)

	// Insert into oferta_carrera table
	for _, idCarrera := range input.IdCarreras {
		var inserted2 AfterInsert2
		err = configs.DB.Raw("INSERT INTO oferta_carrera (id_oferta, id_carrera) VALUES (?, ?) RETURNING id_oferta, id_carrera", inserted.IdOferta, idCarrera).Scan(&inserted2).Error
		if err != nil {
			c.JSON(400, responses.StandardResponse{
				Status:  400,
				Message: "Error creating oferta_carrera: " + err.Error(),
				Data:    nil,
			})
			return
		}
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Offer and oferta_carrera created successfully",
		Data:    nil,
	})

}
