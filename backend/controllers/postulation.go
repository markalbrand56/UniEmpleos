package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"backend/utils"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"net/http"
	"time"
)

type PostulationInput struct {
	IdOferta     int    `json:"id_oferta"`
	IdEstudiante string `json:"id_estudiante"`
	Estado       string `json:"estado"`
}

type GetPostulationInput struct {
	IdOferta int `json:"id_oferta"`
}

type PuestoResult struct {
	Puesto string
}

func NewPostulation(c *gin.Context) {
	var input PostulationInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error binding JSON. " + err.Error(),
			Data:    nil,
		})
		return
	}

	user, err := utils.TokenExtractUsername(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Unauthorized. Cannot get information from token. " + err.Error(),
			Data:    nil,
		})
		return
	}

	if user != input.IdEstudiante {
		c.JSON(http.StatusForbidden, responses.StandardResponse{
			Status:  http.StatusForbidden,
			Message: "The user in the token does not match the user in the request.",
			Data:    nil,
		})
		return
	}

	postulation := models.Postulacion{
		IdOferta:     input.IdOferta,
		IdEstudiante: input.IdEstudiante,
		Estado:       input.Estado,
	}

	var inserted models.PostulacionGet

	err = configs.DB.Raw("INSERT INTO postulacion (id_oferta, id_estudiante, estado) VALUES (?, ?, ?) RETURNING id_postulacion, id_oferta, id_estudiante, estado", postulation.IdOferta, postulation.IdEstudiante, postulation.Estado).Scan(&inserted).Error

	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" {
			c.JSON(http.StatusConflict, responses.StandardResponse{
				Status:  http.StatusConflict,
				Message: "This postulation already exists",
				Data:    nil,
			})
			return
		}

		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error creating. " + err.Error(),
			Data:    nil,
		})
		return
	}

	var resultado PuestoResult

	// Obtener el valor de "puesto" de la oferta
	err = configs.DB.Model(models.Oferta{}).Select("puesto").Where("id_oferta = ?", input.IdOferta).Scan(&resultado).Error
	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting 'puesto' from oferta. " + err.Error(),
			Data:    nil,
		})
		return
	}

	puesto := resultado.Puesto

	// Mensaje con el valor de "puesto"
	mensaje := fmt.Sprintf("Hola, me acabo de postular al puesto de '%s'.", puesto)

	// Nuevo query
	err = configs.DB.Exec("INSERT INTO mensaje (id_postulacion, id_emisor, id_receptor, mensaje, tiempo) VALUES (?, ?, (SELECT id_empresa FROM oferta WHERE id_oferta = ?), ?, ?)", inserted.IdPostulacion, inserted.IdEstudiante, input.IdOferta, mensaje, time.Now()).Error
	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error creating initial message. " + err.Error(),
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Postulation created successfully",
		Data:    nil,
	})
}

type PostulationResult struct {
	IDEstudiante string `json:"id_estudiante"`
	Estado       string `json:"estado"`
	Dpi          string `json:"dpi"`
	Nombre       string `json:"nombre"`
	Apellido     string `json:"apellido"`
	Nacimiento   string `json:"nacimiento"`
	Correo       string `json:"correo"`
	Telefono     string `json:"telefono"`
	Carrera      int    `json:"carrera"`
	Semestre     int    `json:"semestre"`
	CV           string `json:"cv"`
	Foto         string `json:"foto"`
	Contra       string `json:"contra"`
	Universidad  string `json:"universidad"`
}

func GetOfferPreviews(c *gin.Context) {
	var postulations []models.ViewPrevPostulaciones

	err := configs.DB.Find(&postulations).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting postulations. " + err.Error(),
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Previews of offers retrieved successfully",
		Data:    map[string]interface{}{"postulations": postulations},
	})
}

type PostulationFromStudentResult struct {
	IDPostulacion int     `json:"id_postulacion"`
	IDOferta      int     `json:"id_oferta"`
	IDEmpresa     string  `json:"id_empresa"`
	Puesto        string  `json:"puesto"`
	Descripcion   string  `json:"descripcion"`
	Requisitos    string  `json:"requisitos"`
	Salario       float64 `json:"salario"`
}

func GetPostulationFromStudent(c *gin.Context) {
	var results []PostulationFromStudentResult
	var data map[string]interface{}

	idEstudiante, err := utils.TokenExtractUsername(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Could not retrieve info from token. " + err.Error(),
			Data:    nil,
		})
		return
	}

	err = configs.DB.Raw("select id_postulacion, o.id_oferta, id_empresa, puesto, descripcion, requisitos, salario from postulacion p join oferta o on p.id_oferta = o.id_oferta where id_estudiante = ?", idEstudiante).Scan(&results).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error getting postulations",
			Data:    nil,
		})
		return
	}

	data = map[string]interface{}{
		"postulations": results,
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Postulations retrieved successfully",
		Data:    data,
	})

}

func RetirePostulation(c *gin.Context) {
	input := c.Query("id_postulacion")
	user, err := utils.TokenExtractUsername(c)

	if input == "" {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "ID postulation is required as a query parameter",
			Data:    nil,
		})
		return
	}

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Unauthorized. Cannot get information from token. " + err.Error(),
			Data:    nil,
		})
		return
	}

	// verify that the postulation exists
	var postulation models.Postulacion

	err = configs.DB.Where("id_postulacion = ?", input).First(&postulation).Error

	if err != nil {
		c.JSON(http.StatusNotFound, responses.StandardResponse{
			Status:  http.StatusNotFound,
			Message: "Error getting postulation. " + err.Error(),
			Data:    nil,
		})
		return
	}

	// verify that the postulation belongs to the user
	if postulation.IdEstudiante != user {
		c.JSON(http.StatusForbidden, responses.StandardResponse{
			Status:  http.StatusForbidden,
			Message: "The postulation does not belong to the user in the token",
			Data:    nil,
		})
		return
	}

	err = configs.DB.Where("id_postulacion = ? AND id_estudiante = ?", input, user).Delete(&models.Postulacion{}).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "No matching postulation was found. " + err.Error(),
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
