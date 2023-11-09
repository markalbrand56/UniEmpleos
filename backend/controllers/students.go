package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"backend/utils"
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"net/http"
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
		CV:           "",
		Foto:         "",
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
			c.JSON(http.StatusConflict, responses.StandardResponse{
				Status:  409,
				Message: "User with this email already exists",
				Data:    nil,
			})
			return
		}

		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  400,
			Message: "Error creating user. " + err.Error(),
			Data:    nil,
		})
		return
	}

	err = configs.DB.Create(&e).Error // Se agrega el estudiante a la base de datos

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  400,
			Message: "Error creating student. " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Se crea el token
	token, err := utils.GenerateToken(input.Correo, configs.Student)

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  200,
		Message: "Student created successfully",
		Data:    map[string]interface{}{"token": token},
	})
}

type EstudianteUpdateInput struct {
	Nombre      string `json:"nombre"`
	Apellido    string `json:"apellido"`
	Nacimiento  string `json:"nacimiento"`
	Correo      string `json:"correo"`
	Telefono    string `json:"telefono"`
	Carrera     int    `json:"carrera"`
	Semestre    int    `json:"semestre"`
	Foto        string `json:"foto"`
	Universidad string `json:"universidad"`
}

func UpdateStudent(c *gin.Context) {
	var input EstudianteUpdateInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid input. " + err.Error(),
			Data:    nil,
		})
		return
	}

	var originalStudent models.Estudiante
	err := configs.DB.Where("id_estudiante = ?", input.Correo).First(&originalStudent).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Student '" + input.Correo + "' not found: " + err.Error(),
			Data:    nil,
		})
		return
	}

	user, err := utils.TokenExtractUsername(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Could not retrieve info from token. " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Se verifica que el usuario sea el mismo que el del estudiante
	if user != input.Correo {
		c.JSON(http.StatusUnauthorized, responses.StandardResponse{
			Status:  http.StatusUnauthorized,
			Message: "User " + user + " is not authorized to update student " + input.Correo,
			Data:    nil,
		})
		return
	}

	nacimiento, _ := time.Parse("2006-01-02", input.Nacimiento)

	// Crear una instancia del modelo Estudiante con los datos actualizados
	updatedStudent := models.Estudiante{
		Nombre:      input.Nombre,
		Apellido:    input.Apellido,
		Nacimiento:  nacimiento,
		Telefono:    input.Telefono,
		Carrera:     input.Carrera,
		Semestre:    input.Semestre,
		Universidad: input.Universidad,
	}

	err = configs.DB.Model(&models.Estudiante{}).Where("id_estudiante = ?", input.Correo).Updates(updatedStudent).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error updating student. " + err.Error(),
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Student updated successfully",
		Data:    nil,
	})
}
