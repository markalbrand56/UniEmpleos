package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"net/http"
)

type EmpresaInput struct {
	Nombre   string `json:"nombre"`
	Detalles string `json:"detalles"`
	Foto     string `json:"foto"`
	Correo   string `json:"correo"`
	Telefono string `json:"telefono"`
	Contra   string `json:"contra"`
}

func NewCompany(c *gin.Context) {
	var input EmpresaInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid input. " + err.Error(),
			Data:    nil,
		})
		return
	}

	e := models.Empresa{
		IdEmpresa: input.Correo,
		Nombre:    input.Nombre,
		Foto:      input.Foto,
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
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" {
			c.JSON(http.StatusConflict, responses.StandardResponse{
				Status:  http.StatusConflict,
				Message: "User with this email already exists",
				Data:    nil,
			})
			return
		}

		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error creating user. " + err.Error(),
			Data:    nil,
		})
		return
	}

	err = configs.DB.Create(&e).Error // Se agrega la empresa a la base de datos

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error creating company. " + err.Error(),
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Company created successfully",
		Data:    nil,
	})
}

func UpdateCompanies(c *gin.Context) {
	var input EmpresaInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid input. " + err.Error(),
			Data:    nil,
		})
		return
	}

	// No se puede actualizar el correo/id de la empresa
	err := configs.DB.Model(&models.Empresa{}).Where("id_empresa = ?", input.Correo).Updates(models.Empresa{
		Nombre:   input.Nombre,
		Detalles: input.Detalles,
		Foto:     input.Foto,
		Telefono: input.Telefono,
	}).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error updating company. " + err.Error(),
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Company updated successfully",
		Data:    nil,
	})
}
