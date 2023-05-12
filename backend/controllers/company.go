package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
)

type EmpresaInput struct {
	IdEmpresa string `json:"id_empresa"`
	Nombre    string `json:"nombre"`
	Detalles  string `json:"detalles"`
	Correo    string `json:"correo"`
	Telefono  string `json:"telefono"`
}

func NewCompany(c *gin.Context) {
	var input EmpresaInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error binding JSON: " + err.Error(),
			Data:    nil,
		})
		return
	}

	e := models.Empresa{
		IdEmpresa: input.IdEmpresa,
		Nombre:    input.Nombre,
		Detalles:  input.Detalles,
		Correo:    input.Correo,
		Telefono:  input.Telefono,
	}

	err := configs.DB.Create(&e).Error // Se agrega la empresa a la base de datos

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
		Message: "Company created successfully",
		Data:    nil,
	})
}