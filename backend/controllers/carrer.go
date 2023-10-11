package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
	"net/http"
)

type CareerInput struct {
	Nombre      string `json:"nombre"`
	Descripcion string `json:"descripcion"`
}

func NewCareer(c *gin.Context) {
	var input CareerInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid input" + err.Error(),
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
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error creating career" + err.Error(),
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Career created successfully",
		Data:    nil,
	})
}

func GetCareers(c *gin.Context) {
	var careers []models.CarreraGet

	err := configs.DB.Find(&careers).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error retrieving careers" + err.Error(),
			Data:    nil,
		})
		return
	}

	var data map[string]interface{}

	data = map[string]interface{}{
		"careers": careers,
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Careers retrieved successfully",
		Data:    data,
	})
}
