package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
	"strings"
)

type PostulationInput struct {
	IdOferta     int    `json:"id_oferta"`
	IdEstudiante string `json:"id_estudiante"`
	Estado       string `json:"estado"`
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
	err := configs.DB.Raw("INSERT INTO postulacion (id_oferta, id_estudiante, estado) VALUES (?, ?, ?) RETURNING id_postulacion, id_oferta, id_estudiante, estado", postulation.IdOferta, postulation.IdEstudiante, postulation.Estado).Scan(&inserted).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error creating. " + err.Error(),
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
