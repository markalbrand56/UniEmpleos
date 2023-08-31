package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
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
	err := configs.DB.Raw("INSERT INTO postulacion (id_oferta, id_estudiante, estado) VALUES (?, ?, ?) RETURNING id_postulacion, id_oferta, id_estudiante, estado", postulation.IdOferta, postulation.IdEstudiante, postulation.Estado).Scan(&inserted).Error

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

	// Nuevo query
	err = configs.DB.Exec("INSERT INTO mensaje (id_postulacion, id_emisor, id_receptor, mensaje, tiempo) VALUES (?, ?, (SELECT id_empresa FROM oferta WHERE id_oferta = ?), 'Hola, me acabo de postular a esta oferta.', ?)", inserted.IdPostulacion, inserted.IdEstudiante, inserted.IdOferta, time.Now()).Error
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

func GetUserPostulation(c *gin.Context) {
	var input GetPostulationInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error binding JSON. " + err.Error(),
			Data:    nil,
		})
		return
	}

	var results []map[string]interface{}

	rows, err := configs.DB.Raw("SELECT p.id_estudiante, p.estado, e.dpi, e.nombre, e.apellido, e.nacimiento, e.correo, e.telefono, e.carrera, e.semestre, e.cv, e.foto, e.universidad FROM postulacion p JOIN estudiante e ON p.id_estudiante = e.id_estudiante WHERE id_oferta = ?", input.IdOferta).Rows()
	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error getting postulations. " + err.Error(),
			Data:    nil,
		})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var idEstudiante string
		var estado string
		var dpi string
		var nombre string
		var apellido string
		var nacimiento string
		var correo string
		var telefono string
		var carrera int
		var semestre int
		var cv string
		var foto string
		var universidad string
		err := rows.Scan(&idEstudiante, &estado, &dpi, &nombre, &apellido, &nacimiento, &correo, &telefono, &carrera, &semestre, &cv, &foto, &universidad)
		if err != nil {
			c.JSON(400, responses.StandardResponse{
				Status:  400,
				Message: "Error scanning postulation row. " + err.Error(),
				Data:    nil,
			})
			return
		}

		result := map[string]interface{}{
			"id_estudiante": idEstudiante,
			"estado":        estado,
			"dpi":           dpi,
			"nombre":        nombre,
			"apellido":      apellido,
			"nacimiento":    nacimiento,
			"correo":        correo,
			"telefono":      telefono,
			"carrera":       carrera,
			"semestre":      semestre,
			"cv":            cv,
			"foto":          foto,
			"universidad":   universidad,
		}
		results = append(results, result)
	}

	c.JSON(200, responses.PostulationResponse{
		Status:  200,
		Message: "Postulations returned successfully",
		Data:    results,
	})
}

func GetPrevPostulations(c *gin.Context) {
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
