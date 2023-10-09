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
	"strings"
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

	postulation := models.Postulacion{
		IdOferta:     input.IdOferta,
		IdEstudiante: input.IdEstudiante,
		Estado:       input.Estado,
	}

	var inserted models.PostulacionGet

	// TODO: Delete Raw
	//err := configs.DB.Raw("INSERT INTO postulacion (id_oferta, id_estudiante, estado) VALUES (?, ?, ?) RETURNING id_postulacion, id_oferta, id_estudiante, estado", postulation.IdOferta, postulation.IdEstudiante, postulation.Estado).Scan(&inserted).Error

	err := configs.DB.Create(&postulation).Scan(&inserted).Error

	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" {
			c.JSON(http.StatusConflict, responses.StandardResponse{
				Status:  409,
				Message: "This postulation already exists",
				Data:    nil,
			})
			return
		}

		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error creating. " + err.Error(),
			Data:    nil,
		})
		return
	}

	var puesto string

	// Obtener el valor de "puesto" de la oferta
	err = configs.DB.Model(models.Oferta{}).Select("puesto").Where("id_oferta = ?", inserted.IdOferta).Scan(&puesto).Error
	if err != nil {
		c.JSON(408, responses.StandardResponse{
			Status:  408,
			Message: "Error getting 'puesto' from oferta. " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Mensaje con el valor de "puesto"
	mensaje := fmt.Sprintf("Hola, me acabo de postular al puesto de '%s'.", puesto)

	// Nuevo query
	err = configs.DB.Exec("INSERT INTO mensaje (id_postulacion, id_emisor, id_receptor, mensaje, tiempo) VALUES (?, ?, (SELECT id_empresa FROM oferta WHERE id_oferta = ?), ?, ?)", inserted.IdPostulacion, inserted.IdEstudiante, inserted.IdOferta, mensaje, time.Now()).Error
	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error creating initial message. " + err.Error(),
			Data:    nil,
		})
		return
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
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
	var data map[string]interface{}

	err := configs.DB.Find(&postulations).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error getting postulations",
			Data:    nil,
		})
		return
	}

	groupedPostulations := make(map[int][]string)
	for _, p := range postulations {
		groupedPostulations[p.IdOferta] = append(groupedPostulations[p.IdOferta], p.NombreCarrera)
	}

	combinedPostulations := make([]map[string]interface{}, 0)
	for id, carreras := range groupedPostulations {
		combinedCarreras := strings.Join(carreras, ", ")

		combinedPostulations = append(combinedPostulations, map[string]interface{}{
			"id_oferta":       id,
			"puesto":          getPuestosByIDOferta(postulations, id)[0],
			"nombre_empresa":  getNombreEmpresaByIDOferta(postulations, id),
			"nombre_carreras": combinedCarreras,
			"salario":         getSalarioByIDOferta(postulations, id),
		})
	}

	data = map[string]interface{}{
		"postulations": combinedPostulations,
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Postulations retrieved successfully",
		Data:    data,
	})
}

func getPuestosByIDOferta(postulations []models.ViewPrevPostulaciones, id int) []string {
	var puestos []string
	for _, p := range postulations {
		if p.IdOferta == id {
			puestos = append(puestos, p.Puesto)
		}
	}
	return puestos
}

func getNombreEmpresaByIDOferta(postulations []models.ViewPrevPostulaciones, id int) string {
	for _, p := range postulations {
		if p.IdOferta == id {
			return p.NombreEmpresa
		}
	}
	return ""
}

func getSalarioByIDOferta(postulations []models.ViewPrevPostulaciones, id int) float64 {
	for _, p := range postulations {
		if p.IdOferta == id {
			return p.Salario
		}
	}
	return 0
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

func GetPostulactionFromStudent(c *gin.Context) {
	var results []PostulationFromStudentResult
	var data map[string]interface{}

	// obten el id del estudiante a partir del token.
	idEstudiante, err := utils.ExtractTokenUsername(c)
	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error getting id estudiante",
			Data:    nil,
		})
		return
	}

	// en postgreSQL:
	//select id_postulacion, o.id_oferta, id_empresa, puesto, descripcion, requisitos, salario
	//from postulacion p
	//join oferta o
	//on p.id_oferta = o.id_oferta
	//where id_estudiante = 'mor21146@uvg.edu.gt';

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
	user, err := utils.ExtractTokenUsername(c)

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

	err = configs.DB.Where("id_postulacion = ? AND id_estudiante = ?", input, user).First(&postulation).Error

	if err != nil {
		c.JSON(http.StatusNotFound, responses.StandardResponse{
			Status:  http.StatusNotFound,
			Message: "Error getting postulation. " + err.Error(),
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
