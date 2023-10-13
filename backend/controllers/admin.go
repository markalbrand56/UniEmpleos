package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"fmt"
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

func isAdmin(c *gin.Context) (bool, error) {
	role, err := RoleFromToken(c)

	if err != nil {
		return false, err
	}

	if role != "admin" {
		return false, nil
	}
	fmt.Println("Es admin")
	return true, nil
}

func AdminGetStudents(c *gin.Context) {
	var estudiantes []EstudianteGetAdmin

	privileges, err := isAdmin(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting privileges: " + err.Error(),
			Data:    nil,
		})
		return
	}

	if !privileges {
		c.JSON(http.StatusUnauthorized, responses.StandardResponse{
			Status:  http.StatusUnauthorized,
			Message: "This user does not have administrative privileges",
			Data:    nil,
		})
		return
	}

	// Realiza la consulta para obtener la información de los estudiantes con la suspensión
	err = configs.DB.Table("estudiante e").
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

func AdminGetCompanies(c *gin.Context) {
	var empresas []EmpresaGetAdmin

	privileges, err := isAdmin(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting privileges: " + err.Error(),
			Data:    nil,
		})
		return
	}

	if !privileges {
		c.JSON(http.StatusUnauthorized, responses.StandardResponse{
			Status:  http.StatusUnauthorized,
			Message: "This user does not have administrative privileges",
			Data:    nil,
		})
		return
	}

	// Realiza la consulta para obtener la información de las empresas con la suspensión
	err = configs.DB.Table("empresa e").
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

func AdminSuspendAccount(c *gin.Context) {
	var input SuspendAccountInput

	privileges, err := isAdmin(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting privileges: " + err.Error(),
			Data:    nil,
		})
		return
	}

	if !privileges {
		c.JSON(http.StatusUnauthorized, responses.StandardResponse{
			Status:  http.StatusUnauthorized,
			Message: "This user does not have administrative privileges",
			Data:    nil,
		})
		return
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid input. " + err.Error(),
			Data:    nil,
		})
		return
	}

	roleToBeSuspended, err := RoleFromUser(models.Usuario{Usuario: input.IdUsuario})

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting role from the user to be suspended. " + err.Error(),
			Data:    nil,
		})
		return
	}

	if roleToBeSuspended == "admin" {
		c.JSON(http.StatusForbidden, responses.StandardResponse{
			Status:  http.StatusForbidden,
			Message: "Cannot suspend an admin account",
			Data:    nil,
		})
		return
	}

	// Realiza la consulta para obtener la información de las empresas con la suspensión
	err = configs.DB.Model(&models.Usuario{}).Where("usuario = ?", input.IdUsuario).Update("suspendido", input.Suspender).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error suspending account: " + err.Error(),
			Data:    nil,
		})
		return
	}

	if input.Suspender {
		c.JSON(http.StatusOK, responses.StandardResponse{
			Status:  http.StatusOK,
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

func AdminDeleteOffer(c *gin.Context) {
	// con IDOferta del struct Offer, se elimina la oferta por medio de un query.
	idOferta := c.Query("id_oferta")

	privileges, err := isAdmin(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting privileges: " + err.Error(),
			Data:    nil,
		})
		return
	}

	if !privileges {
		c.JSON(http.StatusUnauthorized, responses.StandardResponse{
			Status:  http.StatusUnauthorized,
			Message: "This user does not have administrative privileges",
			Data:    nil,
		})
		return
	}

	err = configs.DB.Where("id_oferta = ?", idOferta).Delete(&models.Oferta{}).Error

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

func AdminDeletePostulation(c *gin.Context) {
	// con IDOferta del struct Offer, se elimina la oferta por medio de un query.
	idPostulacion := c.Query("id_postulacion")

	privileges, err := isAdmin(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting privileges: " + err.Error(),
			Data:    nil,
		})
		return
	}

	if !privileges {
		c.JSON(http.StatusUnauthorized, responses.StandardResponse{
			Status:  http.StatusUnauthorized,
			Message: "This user does not have administrative privileges",
			Data:    nil,
		})
		return
	}

	err = configs.DB.Where("id_postulacion = ?", idPostulacion).Delete(&models.Postulacion{}).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  400,
			Message: "Error deleting postulation: " + err.Error(),
			Data:    nil,
		})
		return
	}
	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  200,
		Message: "Postulation deleted successfully",
		Data:    nil,
	})
}

func AdminDeleteUsuario(c *gin.Context) {
	idUsuario := c.Query("usuario")

	privileges, err := isAdmin(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting privileges: " + err.Error(),
			Data:    nil,
		})
		return
	}

	if !privileges {
		c.JSON(http.StatusUnauthorized, responses.StandardResponse{
			Status:  http.StatusUnauthorized,
			Message: "This user does not have administrative privileges",
			Data:    nil,
		})
		return
	}

	roleToBeDeleted, err := RoleFromUser(models.Usuario{Usuario: idUsuario})

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting role from the user to be deleted. " + err.Error(),
			Data:    nil,
		})
		return
	}

	fmt.Println(roleToBeDeleted)

	if roleToBeDeleted == "admin" {
		c.JSON(http.StatusForbidden, responses.StandardResponse{
			Status:  http.StatusForbidden,
			Message: "Cannot delete an admin account",
			Data:    nil,
		})
		return
	}

	err = configs.DB.Where("usuario = ?", idUsuario).Delete(&models.Usuario{}).Error

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
