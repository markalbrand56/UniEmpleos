package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

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

	c.JSON(http.StatusOK, responses.StandardResponse{
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

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  200,
		Message: "Companies Retrieved Successfully",
		Data:    messageMap,
	})
}

type SuspendAccountInput struct {
	IdUsuario string `json:"id_usuario"`
	Suspender bool   `json:"suspender"` // True para suspender, false para reactivar
}

func SuspendAccount(c *gin.Context) {
	var input SuspendAccountInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error binding JSON: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Realiza la consulta para obtener la información de las empresas con la suspensión
	err := configs.DB.Model(&models.Usuario{}).Where("usuario = ?", input.IdUsuario).Update("suspendido", input.Suspender).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  400,
			Message: "Error suspending account: " + err.Error(),
			Data:    nil,
		})
		return
	}

	if input.Suspender {
		c.JSON(http.StatusOK, responses.StandardResponse{
			Status:  200,
			Message: "Account Suspended Successfully",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  200,
		Message: "Account Reactivated Successfully",
		Data:    nil,
	})
}

type Offer struct {
	IDOferta    int      `json:"id_oferta"`
	IDEmpresa   string   `json:"id_empresa"`
	Puesto      string   `json:"puesto"`
	Descripcion string   `json:"descripcion"`
	Requisitos  string   `json:"requisitos"`
	Salario     float64  `json:"salario"`
	IdCarreras  []string `json:"id_carreras"`
}

func DeleteOfferAdmin(c *gin.Context) {
	// con IDOferta del struct Offer, se elimina la oferta por medio de un query.
	idOferta := c.Query("id_oferta")

	err := configs.DB.Where("id_oferta = ?", idOferta).Delete(&models.Oferta{}).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  400,
			Message: "Error deleting offer: " + err.Error(),
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  200,
		Message: "Offer deleted successfully",
		Data:    nil,
	})

}

func DeleteUsuario(c *gin.Context) {
	idUsuario := c.Query("usuario")

	err := configs.DB.Where("usuario = ?", idUsuario).Delete(&models.Usuario{}).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  400,
			Message: "Error deleting user: " + err.Error(),
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  200,
		Message: "User deleted successfully",
		Data:    nil,
	})

}
