package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
	"time"
)

type MessageInput struct {
	ID_postulacion int    `json:"id_postulacion"`
	ID_emisor      string `json:"id_emisor"`
	ID_receptor    string `json:"id_receptor"`
	Mensaje        string `json:"mensaje"`
}

func SendMessage(c *gin.Context) {
	var input MessageInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error binding JSON: " + err.Error(),
			Data:    nil,
		})
		return
	}

	t, _ := time.Parse("2006-01-02 15:04:05", time.Now().Format("2006-01-02 15:04:05"))

	m := models.Mensaje{
		IdPostulacion: input.ID_postulacion,
		IdEmisor:      input.ID_emisor,
		IdReceptor:    input.ID_receptor,
		Mensaje:       input.Mensaje,
		Tiempo:        t,
	}

	err := configs.DB.Create(&m).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error creating message. " + err.Error(),
			Data:    nil,
		})
		return
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Message sent successfully",
		Data:    nil,
	})
}
