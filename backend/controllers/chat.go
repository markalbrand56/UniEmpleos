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

type MessageOutput struct {
	ID_emisor   string `json:"id_emisor"`
	ID_receptor string `json:"id_receptor"`
}

func GetMessages(c *gin.Context) {
	var inputID MessageOutput

	if err := c.ShouldBindJSON(&inputID); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var messages []models.MensajeGet
	err := configs.DB.
		Table("mensaje m").
		Select("es.nombre as emisor_nombre, es.foto as emisor_foto, em.nombre as receptor_nombre, em.foto as receptor_foto, m.*").
		Joins("JOIN estudiante es ON m.id_emisor = es.id_estudiante OR m.id_receptor = es.id_estudiante").
		Joins("JOIN empresa em ON m.id_emisor = em.id_empresa OR m.id_receptor = em.id_empresa").
		Where("(m.id_emisor = ? AND m.id_receptor = ?) OR (m.id_emisor = ? AND m.id_receptor = ?)",
			inputID.ID_emisor, inputID.ID_receptor,
			inputID.ID_receptor, inputID.ID_emisor).
		Find(&messages).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error getting messages",
			Data:    nil,
		})
		return
	}

	// Convertimos messages a un mapa
	messageMap := map[string]interface{}{"messages": messages}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Messages retrieved successfully",
		Data:    messageMap,
	})
}

type MessageOutputLastChat struct {
	ID_usuario string `json:"id_usuario"`
}

func GetLastChat(c *gin.Context) {
	var inputID MessageOutputLastChat

	if err := c.ShouldBindJSON(&inputID); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var chat models.ChatInfo

	// Consulta SQL pura con alias y parámetro ?
	query := `SELECT p.id_postulacion as chat_id,
					CASE WHEN p.id_estudiante = ? THEN e2.nombre ELSE e.nombre END as user_name,
					CASE WHEN p.id_estudiante = ? THEN e2.foto ELSE e.foto END as user_photo,
					m.mensaje as last_message,
					m.tiempo as last_time
			  FROM postulacion p
			  JOIN mensaje m ON p.id_postulacion = m.id_postulacion
			  JOIN oferta o ON p.id_oferta = o.id_oferta
			  JOIN estudiante e ON p.id_estudiante = e.id_estudiante
			  JOIN empresa e2 ON o.id_empresa = e2.id_empresa
			  WHERE p.id_estudiante = ? OR o.id_empresa = ?
			  ORDER BY m.tiempo DESC
			  LIMIT 1`

	// Ejecutamos la consulta SQL pura con parámetros inputID.ID_usuario
	err := configs.DB.Raw(query, inputID.ID_usuario, inputID.ID_usuario, inputID.ID_usuario, inputID.ID_usuario).Scan(&chat).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error getting messages",
			Data:    nil,
		})
		return
	}

	// Convertimos el resultado en un mapa
	messageMap := map[string]interface{}{"message": chat}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Message retrieved successfully",
		Data:    messageMap,
	})
}
