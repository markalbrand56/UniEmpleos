package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
	"time"
)

type EstudianteInput struct {
	Dpi         string `json:"dpi"`
	Nombre      string `json:"nombre"`
	Apellido    string `json:"apellido"`
	Nacimiento  string `json:"nacimiento"`
	Correo      string `json:"correo"`
	Telefono    string `json:"telefono"`
	Carrera     int    `json:"carrera"`
	Semestre    int    `json:"semestre"`
	CV          string `json:"cv"`
	Foto        string `json:"foto"`
	Contra      string `json:"contra"`
	Universidad string `json:"universidad"`
}

func NewStudent(c *gin.Context) {
	var input EstudianteInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error binding JSON: " + err.Error(),
			Data:    nil,
		})
		return
	}

	t, _ := time.Parse("2006-01-02", input.Nacimiento)

	e := models.Estudiante{
		IdEstudiante: input.Correo,
		Dpi:          input.Dpi,
		Nombre:       input.Nombre,
		Apellido:     input.Apellido,
		Nacimiento:   t,
		Telefono:     input.Telefono,
		Carrera:      input.Carrera,
		Semestre:     input.Semestre,
		CV:           input.CV,
		Foto:         input.Foto,
		Correo:       input.Correo,
	}

	u := models.Usuario{
		Usuario: input.Correo,
		Contra:  input.Contra,
	}

	err := configs.DB.Updates(&u).Error // Se agrega el usuario a la base de datos
	err = configs.DB.Updates(&e).Error  // Se agrega el estudiante a la base de datos

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
		Message: "Student created successfully",
		Data:    nil,
	})
}

func UpdateStudent(c *gin.Context) {
	var input EstudianteInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error binding JSON: " + err.Error(),
			Data:    nil,
		})
		return
	}

	t, _ := time.Parse("2006-01-02", input.Nacimiento)

	e := models.Estudiante{
		IdEstudiante: input.Correo,
		Dpi:          input.Dpi,
		Nombre:       input.Nombre,
		Apellido:     input.Apellido,
		Nacimiento:   t,
		Telefono:     input.Telefono,
		Carrera:      input.Carrera,
		Semestre:     input.Semestre,
		CV:           input.CV,
		Foto:         input.Foto,
		Correo:       input.Correo,
	}

	err := configs.DB.Model(&e).Updates(&e).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error updating",
			Data:    nil,
		})
		return
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Student updated successfully",
		Data:    nil,
	})
}
