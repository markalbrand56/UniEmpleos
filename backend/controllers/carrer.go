package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
	"net/http"
)

// Input para crear una nueva carrera
type CareerInput struct {
	Nombre      string `json:"nombre"`
	Descripcion string `json:"descripcion"`
}

// Funcion para crear una nueva carrera
func NewCareer(c *gin.Context) {
	var input CareerInput

	// Verificar que el usuario sea administrador
	err := IsAdmin(c)

	if err != nil {
		c.JSON(http.StatusUnauthorized, responses.StandardResponse{
			Status:  http.StatusUnauthorized,
			Message: "Error getting privileges: " + err.Error(),
			Data:    nil,
		})
		return
	}

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

	// Insertar carrera en la base de datos
	err = configs.DB.Raw("INSERT INTO carrera (nombre, descripcion) VALUES (?, ?)", carrera.Nombre, carrera.Descripcion).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error creating career: " + err.Error(),
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

// Funcion para obtener todas las carreras
func GetCareers(c *gin.Context) {
	var careers []models.CarreraGet

	// Buscar todas las carreras en la base de datos
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

	// Crear mapa para enviar los datos
	data = map[string]interface{}{
		"careers": careers,
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Careers retrieved successfully",
		Data:    data,
	})
}
