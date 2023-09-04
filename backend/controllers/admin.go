package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

type AdministradorInput struct {
	IdAdministrador string `json:"id_administrador"`
	Nombre          string `json:"nombre"`
	Apellido        string `json:"apellido"`
}

func NewAdmin(c *gin.Context) {
	var input AdministradorInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error binding JSON: " + err.Error(),
			Data:    nil,
		})
		return
	}

	a := models.Administrador{
		IdAdministrador: input.IdAdministrador,
		Nombre:          input.Nombre,
		Apellido:        input.Apellido,
	}

	err := configs.DB.Create(&a).Error // Se agrega el administrador a la base de datos

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
		Message: "Admin Created Successfully",
		Data:    nil,
	})
}

type EstudianteGetAdmin struct {
	IdEstudiante string    `json:"id_estudiante"`
	Nombre       string    `json:"nombre"`
	Apellido     string    `json:"apellido"`
	Nacimiento   time.Time `json:"nacimiento"`
	Suspendido   bool      `json:"suspendido"`
}

func GetStudents(c *gin.Context) {
	var estudiantes []EstudianteGetAdmin

	// Realiza la consulta para obtener la información de los estudiantes con la suspensión
	err := configs.DB.Table("estudiante e").
		Select("e.id_estudiante, e.nombre, e.apellido, e.nacimiento, u.suspendido").
		Joins("INNER JOIN usuario u ON e.id_estudiante = u.usuario").
		Scan(&estudiantes).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  400,
			Message: "Error retrieving students: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Convertimos el resultado en un mapa
	messageMap := map[string]interface{}{"studets": estudiantes}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Students Retrieved Successfully",
		Data:    messageMap,
	})
}

type EmpresaGetAdmin struct {
	IdEmpresa  string `json:"id_empresa"`
	Nombre     string `json:"nombre"`
	Detalles   string `json:"detalles"`
	Telefono   string `json:"telefono"`
	Suspendido bool   `json:"suspendido"`
}

func GetCompanies(c *gin.Context) {
	var empresas []EmpresaGetAdmin

	// Realiza la consulta para obtener la información de las empresas con la suspensión
	err := configs.DB.Table("empresa e").
		Select("e.id_empresa, e.nombre, e.detalles, e.telefono, u.suspendido").
		Joins("INNER JOIN usuario u ON e.id_empresa = u.usuario").
		Scan(&empresas).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  400,
			Message: "Error retrieving companies: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Convertimos el resultado en un mapa
	messageMap := map[string]interface{}{"companies": empresas}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Companies Retrieved Successfully",
		Data:    messageMap,
	})
}
