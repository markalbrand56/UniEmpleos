package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
)

type EmpresaInput struct {
	Nombre   string `json:"nombre"`
	Detalles string `json:"detalles"`
	Correo   string `json:"correo"`
	Telefono string `json:"telefono"`
	Contra   string `json:"contra"`
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
		IdEmpresa: input.Correo,
		Nombre:    input.Nombre,
		Detalles:  input.Detalles,
		Correo:    input.Correo,
		Telefono:  input.Telefono,
	}

	u := models.Usuario{
		Usuario: input.Correo,
		Contra:  input.Contra,
	}

	err := configs.DB.Create(&u).Error // Se agrega el usuario a la base de datos

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error creating user. " + err.Error(),
			Data:    nil,
		})
		return
	}

	err = configs.DB.Create(&e).Error // Se agrega la empresa a la base de datos

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error creating company. " + err.Error(),
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

func UpdateCompanies(c *gin.Context) {
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
		IdEmpresa: input.Correo,
		Nombre:    input.Nombre,
		Detalles:  input.Detalles,
		Correo:    input.Correo,
		Telefono:  input.Telefono,
	}

	// update the row of the given id
	err := configs.DB.Model(&e).Where("id_empresa = ?", input.Correo).Updates(&e).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error updating",
			Data:    nil,
		})
		return
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Company updated successfully",
		Data:    nil,
	})

}
