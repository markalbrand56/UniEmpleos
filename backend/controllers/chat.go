package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"github.com/gin-gonic/gin"
	"time"
)

// Input para enviar un mensaje
type MessageInput struct {
	ID_postulacion int    `json:"id_postulacion"`
	ID_emisor      string `json:"id_emisor"`
	ID_receptor    string `json:"id_receptor"`
	Mensaje        string `json:"mensaje"`
}

// Funcion para enviar un mensaje
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

	// Parseamos el tiempo actual
	t, _ := time.Parse("2006-01-02 15:04:05", time.Now().Format("2006-01-02 15:04:05"))

	m := models.Mensaje{
		IdPostulacion: input.ID_postulacion,
		IdEmisor:      input.ID_emisor,
		IdReceptor:    input.ID_receptor,
		Mensaje:       input.Mensaje,
		Tiempo:        t,
	}

	// Insertamos el mensaje en la base de datos
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

// Input para obtener los mensajes
type MessageOutput struct {
	ID_emisor   string `json:"id_emisor"`
	ID_receptor string `json:"id_receptor"`
}

// Funcion para obtener los mensajes
func GetMessages(c *gin.Context) {
	var inputID MessageOutput

	if err := c.ShouldBindJSON(&inputID); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var messages []models.MensajeGet

	// Consulta SQL raw ya que no se puede hacer con GORM por la complejidad de la consulta
	query := `Select CASE WHEN (m.id_emisor = ? AND es.id_estudiante = ?) OR (m.id_emisor = ? AND es.id_estudiante = ?) THEN es.nombre
       WHEN (m.id_emisor = ? AND em.id_empresa = ?) OR (m.id_emisor = ? AND em.id_empresa = ?) THEN em.nombre END as emisor_nombre,
       CASE WHEN (m.id_receptor = ? AND es.id_estudiante = ?) OR (m.id_receptor = ? AND es.id_estudiante = ?) THEN es.nombre
       WHEN (m.id_receptor = ? and em.id_empresa = ?) OR (m.id_receptor = ? and em.id_empresa = ?) THEN em.nombre END as receptor_nombre,
       CASE WHEN (m.id_emisor = ? and es.id_estudiante = ?) OR (m.id_emisor = ? and es.id_estudiante = ?) THEN es.foto
       WHEN (m.id_emisor = ? and em.id_empresa = ?) OR (m.id_emisor = ? and em.id_empresa = ?) THEN em.foto END as emisor_foto,
       m.*
       from mensaje m
         join estudiante es on m.id_emisor = es.id_estudiante or m.id_receptor = es.id_estudiante
         join empresa em on m.id_emisor = em.id_empresa or m.id_receptor = em.id_empresa
         where (id_emisor = ? and id_receptor = ?)
         or (id_emisor = ? and id_receptor = ?)
		 order by m.tiempo asc;`

	// Ejecutamos la consulta SQL con parámetros inputID.ID_usuario
	err := configs.DB.Raw(query, inputID.ID_emisor, inputID.ID_emisor, inputID.ID_receptor, inputID.ID_receptor,
		inputID.ID_emisor, inputID.ID_emisor, inputID.ID_receptor, inputID.ID_receptor,
		inputID.ID_receptor, inputID.ID_receptor, inputID.ID_emisor, inputID.ID_emisor,
		inputID.ID_receptor, inputID.ID_receptor, inputID.ID_emisor, inputID.ID_emisor,
		inputID.ID_emisor, inputID.ID_emisor, inputID.ID_receptor, inputID.ID_receptor,
		inputID.ID_emisor, inputID.ID_emisor, inputID.ID_receptor, inputID.ID_receptor,
		inputID.ID_emisor, inputID.ID_receptor,
		inputID.ID_receptor, inputID.ID_emisor,
	).Scan(&messages).Error

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

// Input para obtener los previews de los chats
type MessageOutputLastChat struct {
	ID_usuario string `json:"id_usuario"`
}

// Funcion para obtener los previews de los chats
func GetLastChat(c *gin.Context) {
	var inputID MessageOutputLastChat

	if err := c.ShouldBindJSON(&inputID); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Ver si el usuario es válido
	_, err := models.GetUserByUsername(inputID.ID_usuario)

	if err != nil {
		c.JSON(404, responses.StandardResponse{
			Status:  404,
			Message: "Error getting messages. User not found",
			Data:    nil,
		})
		return
	}

	var chats []models.ChatInfo

	// Consulta SQL raw ya que no se puede hacer con GORM por la complejidad de la consulta
	query := `SELECT p.id_postulacion as postulation_id,
       				CASE WHEN p.id_estudiante = ? THEN e2.id_empresa ELSE e.id_estudiante END as user_id,
					CASE WHEN p.id_estudiante = ? THEN e2.nombre ELSE e.nombre END as user_name,
					CASE WHEN p.id_estudiante = ? THEN e2.foto ELSE e.foto END as user_photo,
					m.mensaje as last_message,
					m.tiempo as last_time
			  FROM postulacion p
			  JOIN mensaje m ON p.id_postulacion = m.id_postulacion
			  JOIN oferta o ON p.id_oferta = o.id_oferta
			  JOIN estudiante e ON p.id_estudiante = e.id_estudiante
			  JOIN empresa e2 ON o.id_empresa = e2.id_empresa
			  JOIN (
			  	SELECT id_postulacion, MAX(tiempo) as max_tiempo
				FROM mensaje
				GROUP BY id_postulacion
			  ) max_msg ON m.id_postulacion = max_msg.id_postulacion AND m.tiempo = max_msg.max_tiempo
			  WHERE p.id_estudiante = ? OR o.id_empresa = ?
			  ORDER BY m.tiempo DESC`

	// Ejecutamos la consulta SQL pura con parámetros inputID.ID_usuario
	err = configs.DB.Raw(query, inputID.ID_usuario, inputID.ID_usuario, inputID.ID_usuario, inputID.ID_usuario, inputID.ID_usuario).Scan(&chats).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error getting messages",
			Data:    nil,
		})
		return
	}

	// Convertimos el resultado en un mapa
	messageMap := map[string]interface{}{"messages": chats}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Messages retrieved successfully",
		Data:    messageMap,
	})
}

// Input para eliminar un chat
type DeleteChatInput struct {
	Id_Postulacion string `json:"id_postulacion"`
}

func DeleteChat(c *gin.Context) {

	// Obtener el id_postulacion desde los query parameters
	idPostulacion := c.Query("id_postulacion")

	// Verifica si el valor del parámetro está presente
	if idPostulacion == "" {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Missing id_postulacion parameter",
			Data:    nil,
		})
		return
	}

	// Eliminar el chat de la base de datos
	err := configs.DB.Where("id_postulacion = ?", idPostulacion).Delete(&models.Mensaje{}).Error
	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error deleting chat",
			Data:    nil,
		})
		return
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Chat deleted successfully",
		Data:    nil,
	})
}
