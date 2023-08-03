package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
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
		Universidad:  input.Universidad,
	}

	u := models.Usuario{
		Usuario: input.Correo,
		Contra:  input.Contra,
	}

	err := configs.DB.Create(&u).Error // Se agrega el usuario a la base de datos

	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" {
			c.JSON(409, responses.StandardResponse{
				Status:  409,
				Message: "User with this email already exists",
				Data:    nil,
			})
			return
		}

		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error creating user. " + err.Error(),
			Data:    nil,
		})
		return
	}

	err = configs.DB.Create(&e).Error // Se agrega el estudiante a la base de datos

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error creating student. " + err.Error(),
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

	nacimiento, _ := time.Parse("2006-01-02", input.Nacimiento)

	fmt.Println(input) // TODO BORRAR ESTO

	var inserted models.EstudianteGet

	err := configs.DB.Raw("UPDATE estudiante SET nombre = ?, apellido = ?, nacimiento = ?, telefono = ?, carrera = ?, semestre = ?, cv = ?, foto = ?, universidad = ? WHERE id_estudiante = ? RETURNING id_estudiante", input.Nombre, input.Apellido, nacimiento, input.Telefono, input.Carrera, input.Semestre, input.CV, input.Foto, input.Universidad, input.Correo).Scan(&inserted).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error updating. " + err.Error(),
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
