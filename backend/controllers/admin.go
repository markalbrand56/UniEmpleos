package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"backend/utils"
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
	Foto         string    `json:"foto"`
	Suspendido   bool      `json:"suspendido"`
}

func IsAdmin(c *gin.Context) error {
	// Solo retorna un error si el usuario no es un administrador
	role, err := utils.TokenExtractRole(c)

	if err != nil {
		return fmt.Errorf("error getting role from token: %s", err.Error())
	}

	if role != "admin" {
		user, err := utils.TokenExtractUsername(c)

		if err != nil {
			return fmt.Errorf("error getting username from token: %s", err.Error())
		}

		return fmt.Errorf("user '%s' is not an admin", user)
	}
	fmt.Println("Es admin")
	return nil
}

func AdminGetStudents(c *gin.Context) {
	var estudiantes []EstudianteGetAdmin

	err := IsAdmin(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting privileges: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Realiza la consulta para obtener la información de los estudiantes con la suspensión
	err = configs.DB.Table("estudiante e").
		Select("e.id_estudiante, e.nombre, e.apellido, e.nacimiento, e.foto, u.suspendido").
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
		Status:  http.StatusOK,
		Message: "Students Retrieved Successfully",
		Data:    messageMap,
	})
}

type EmpresaGetAdmin struct {
	IdEmpresa  string `json:"id_empresa"`
	Nombre     string `json:"nombre"`
	Detalles   string `json:"detalles"`
	Telefono   string `json:"telefono"`
	Foto       string `json:"foto"`
	Suspendido bool   `json:"suspendido"`
}

func AdminGetCompanies(c *gin.Context) {
	var empresas []EmpresaGetAdmin

	err := IsAdmin(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting privileges: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Realiza la consulta para obtener la información de las empresas con la suspensión
	err = configs.DB.Table("empresa e").
		Select("e.id_empresa, e.nombre, e.detalles, e.telefono, e.foto, u.suspendido").
		Joins("INNER JOIN usuario u ON e.id_empresa = u.usuario").
		Scan(&empresas).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error retrieving companies: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Convertimos el resultado en un mapa
	messageMap := map[string]interface{}{"companies": empresas}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
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

	err := IsAdmin(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting privileges: " + err.Error(),
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
		Status:  http.StatusOK,
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

	err := IsAdmin(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting privileges: " + err.Error(),
			Data:    nil,
		})
		return
	}

	err = configs.DB.Where("id_oferta = ?", idOferta).Delete(&models.Oferta{}).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error deleting offer. " + err.Error(),
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Offer deleted successfully",
		Data:    nil,
	})

}

func AdminDeletePostulation(c *gin.Context) {
	// con IDOferta del struct Offer, se elimina la oferta por medio de un query.
	idPostulacion := c.Query("id_postulacion")

	err := IsAdmin(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting privileges. " + err.Error(),
			Data:    nil,
		})
		return
	}

	err = configs.DB.Where("id_postulacion = ?", idPostulacion).Delete(&models.Postulacion{}).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error deleting postulation: " + err.Error(),
			Data:    nil,
		})
		return
	}
	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Postulation deleted successfully",
		Data:    nil,
	})
}

func AdminDeleteUser(c *gin.Context) {
	idUsuario := c.Query("usuario")

	err := IsAdmin(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting privileges. " + err.Error(),
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
			Status:  http.StatusBadRequest,
			Message: "Error deleting user. " + err.Error(),
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "User deleted successfully",
		Data:    nil,
	})

}

type AdminDetailsStudent struct {
	Correo      string    `json:"correo"`
	Nombre      string    `json:"nombre"`
	Apellido    string    `json:"apellido"`
	Nacimiento  time.Time `json:"nacimiento"`
	Telefono    string    `json:"telefono"`
	Carrera     int       `json:"carrera"`
	Semestre    int       `json:"semestre"`
	CV          string    `json:"cv"`
	Foto        string    `json:"foto"`
	Universidad string    `json:"universidad"`
	Suspendido  bool      `json:"suspendido"`
}

type AdminDetailsEnterprise struct {
	Correo     string `json:"correo"`
	Nombre     string `json:"nombre"`
	Foto       string `json:"foto"`
	Detalles   string `json:"detalles"`
	Suspendido bool   `json:"suspendido"`
}

func AdminGetUserDetails(c *gin.Context) {
	var input UserDetailsInput // Correo del usuario a buscar

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid input. " + err.Error(),
			Data:    nil,
		})
		return
	}

	err := IsAdmin(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting privileges. " + err.Error(),
			Data:    nil,
		})
		return
	}

	userType, err := RoleFromUser(models.Usuario{Usuario: input.Correo})

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "User not found. " + err.Error(),
			Data:    nil,
		})
		return
	}

	switch userType {
	case "student":
		var usuario models.Usuario
		var estudiante models.Estudiante

		err = configs.DB.Where("usuario = ?", input.Correo).First(&usuario).Error
		if err != nil {
			c.JSON(http.StatusBadRequest, responses.StandardResponse{
				Status:  http.StatusBadRequest,
				Message: "User not found. " + err.Error(),
				Data:    nil,
			})
			return
		}

		err = configs.DB.Where("id_estudiante = ?", input.Correo).First(&estudiante).Error
		if err != nil {
			c.JSON(http.StatusBadRequest, responses.StandardResponse{
				Status:  http.StatusBadRequest,
				Message: "Student not found. " + err.Error(),
				Data:    nil,
			})
			return
		}

		c.JSON(http.StatusOK, responses.StandardResponse{
			Status:  http.StatusOK,
			Message: "Student found",
			Data: map[string]interface{}{
				"student": AdminDetailsStudent{
					Correo:      estudiante.Correo,
					Nombre:      estudiante.Nombre,
					Apellido:    estudiante.Apellido,
					Nacimiento:  estudiante.Nacimiento,
					Telefono:    estudiante.Telefono,
					Carrera:     estudiante.Carrera,
					Semestre:    estudiante.Semestre,
					CV:          estudiante.CV,
					Foto:        estudiante.Foto,
					Universidad: estudiante.Universidad,
					Suspendido:  usuario.Suspendido,
				},
			},
		})
	case "enterprise":
		var usuario models.Usuario
		err = configs.DB.Where("usuario = ?", input.Correo).First(&usuario).Error

		if err != nil {
			c.JSON(http.StatusBadRequest, responses.StandardResponse{
				Status:  http.StatusBadRequest,
				Message: "User not found. " + err.Error(),
				Data:    nil,
			})
			return
		}

		var empresa models.Empresa
		err = configs.DB.Where("id_empresa = ?", input.Correo).First(&empresa).Error
		if err != nil {
			c.JSON(http.StatusBadRequest, responses.StandardResponse{
				Status:  http.StatusBadRequest,
				Message: "Enterprise not found. " + err.Error(),
				Data:    nil,
			})
			return
		}

		c.JSON(http.StatusOK, responses.StandardResponse{
			Status:  http.StatusOK,
			Message: "Enterprise found",
			Data: map[string]interface{}{
				"company": AdminDetailsEnterprise{
					Correo:     empresa.Correo,
					Nombre:     empresa.Nombre,
					Foto:       empresa.Foto,
					Detalles:   empresa.Detalles,
					Suspendido: usuario.Suspendido,
				},
			},
		})
	case "admin":
		c.JSON(http.StatusForbidden, responses.StandardResponse{
			Status:  http.StatusForbidden,
			Message: "Admins cannot be viewed",
			Data:    nil,
		})
	default:
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "User not found. " + err.Error(),
			Data:    nil,
		})
	}
}

type PostulationsResults struct {
	IdUsuario     string `json:"id_usuario"`
	Nombre        string `json:"nombre"`
	Apellido      string `json:"apellido"`
	IdPostulacion int    `json:"id_postulacion"`
	IdOferta      int    `json:"id_oferta"`
	Estado        string `json:"estado"`
}

func GetPostulationsOfStudentAsAdmin(c *gin.Context) {
	// Devolver lo mismo que GetPostulationsFromStudent pero como admin.

	var results []PostulationsResults
	var data map[string]interface{}

	// id del estudiante como query.
	idEstudiante := c.Query("id_estudiante")

	err := IsAdmin(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting privileges. " + err.Error(),
			Data:    nil,
		})
		return
	}

	err = configs.DB.Raw("select u.usuario, e.nombre, e.apellido, p.id_postulacion, p.id_oferta, p.estado from usuario u join estudiante e on u.usuario = e.id_estudiante join postulacion p on e.id_estudiante = p.id_estudiante where u.usuario = ?", idEstudiante).Scan(&results).Error
	fmt.Println(err)
	fmt.Println(results)

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error getting postulations",
			Data:    nil,
		})
		return
	}

	// meter los resultados en un mapa
	data = map[string]interface{}{
		"postulations": results,
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Postulations retrieved successfully",
		Data:    data,
	})
}
