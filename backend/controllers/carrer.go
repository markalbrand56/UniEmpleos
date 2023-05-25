package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
)

type CareerInput struct {
	Nombre      string `json:"nombre"`
	Descripcion string `json:"descripcion"`
}

func NewCareer(c *gin.Context) {
	var input CareerInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error binding JSON: " + err.Error(),
			Data:    nil,
		})
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
			Message: "Error creating career. " + err.Error(),
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

func GetCareers(c *gin.Context) {
	var careers []models.CarreraGet

	err := configs.DB.Find(&careers).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error getting careers",
			Data:    nil,
		})
		return
	}

	var data map[string]interface{}

	data = map[string]interface{}{
		"careers": careers,
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Careers retrieved successfully",
		Data:    data,
	})
}
