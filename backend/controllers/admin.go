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

// Input para la función AdminGetStudents
type EstudianteGetAdmin struct {
	IdEstudiante string    `json:"id_estudiante"`
	Nombre       string    `json:"nombre"`
	Apellido     string    `json:"apellido"`
	Nacimiento   time.Time `json:"nacimiento"`
	Foto         string    `json:"foto"`
	Suspendido   bool      `json:"suspendido"`
}

// funcion para determinar si el usuario es administador
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

// funcion para obtener a los estudiantes para el admin
func AdminGetStudents(c *gin.Context) {
	var estudiantes []EstudianteGetAdmin

	//verifica si el usuario es administrador
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

// Input para la función AdminGetCompanies
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

	//verifica si el usuario es administrador
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

// Input para la función AdminSuspendAccount
type SuspendAccountInput struct {
	IdUsuario string `json:"id_usuario"`
	Suspender bool   `json:"suspender"` // True para suspender, false para reactivar
}

func AdminSuspendAccount(c *gin.Context) {
	var input SuspendAccountInput

	//verifica si el usuario es administrador
	err := IsAdmin(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting privileges: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Obtiene el input del JSON
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid input. " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Obtiene el rol del usuario a suspender
	roleToBeSuspended, err := RoleFromUser(models.Usuario{Usuario: input.IdUsuario})

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting role from the user to be suspended. " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Verifica que el rol a suspender no sea admin
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

func AdminDeleteOffer(c *gin.Context) {
	// con IDOferta del struct Offer, se elimina la oferta por medio de un query.
	idOferta := c.Query("id_oferta")

	//verifica si el usuario es administrador
	err := IsAdmin(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting privileges: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Query para eliminar la oferta
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

	//verifica si el usuario es administrador
	err := IsAdmin(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting privileges. " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Query para eliminar la postulación
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
	// Se busca el id del usuario ingresado en la ruta
	idUsuario := c.Query("usuario")

	// verifica si el usuario es administrador
	err := IsAdmin(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting privileges. " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Se busca el rol del usuario a eliminar
	roleToBeDeleted, err := RoleFromUser(models.Usuario{Usuario: idUsuario})

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting role from the user to be deleted. " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Verifica que el rol a eliminar no sea admin
	if roleToBeDeleted == "admin" {
		c.JSON(http.StatusForbidden, responses.StandardResponse{
			Status:  http.StatusForbidden,
			Message: "Cannot delete an admin account",
			Data:    nil,
		})
		return
	}

	// Query para eliminar el usuario
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

// Input para la función AdminGetUserDetails (estudiante)
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

// Input para la función AdminGetUserDetails (empresa)
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

	//verifica si el usuario es administrador
	err := IsAdmin(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting privileges. " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Obtiene el rol del usuario a suspender
	userType, err := RoleFromUser(models.Usuario{Usuario: input.Correo})

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "User not found. " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Dependiendo del rol, se obtiene la información del usuario
	switch userType {
	case "student":
		var usuario models.Usuario
		var estudiante models.Estudiante

		// Query para obtener la información del usuario
		err = configs.DB.Where("usuario = ?", input.Correo).First(&usuario).Error
		if err != nil {
			c.JSON(http.StatusBadRequest, responses.StandardResponse{
				Status:  http.StatusBadRequest,
				Message: "User not found. " + err.Error(),
				Data:    nil,
			})
			return
		}

		// Query para obtener la información del estudiante
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

		// Query para obtener la información del usuario
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

		// Query para obtener la información de la empresa
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
	case "admin": // No se puede ver la información de un administrador
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

// Input para la función GetPostulationsOfStudentAsAdmin
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

	//verifica si el usuario es administrador
	err := IsAdmin(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting privileges. " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Query para obtener las postulaciones del estudiante
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
