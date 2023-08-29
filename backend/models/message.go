package models

import (
	"time"
)

// Mensaje es la estructura de la tabla mensaje en la base de datos
type Mensaje struct {
	//ID_mensaje     int       `json:"id_mensaje"`  // Al ser serial, no es necesario especificarlo
	IdPostulacion int       `json:"id_postulacion"`
	IdEmisor      string    `json:"id_emisor"`
	IdReceptor    string    `json:"id_receptor"`
	Mensaje       string    `json:"mensaje"`
	Tiempo        time.Time `json:"tiempo"`
}

// mensajeGet es la estructura de la tabla mensaje en la base de datos
type MensajeGet struct {
	ID_mensaje     int       `json:"id_mensaje"`
	IdEmisor       string    `json:"id_emisor"`
	IdReceptor     string    `json:"id_receptor"`
	Mensaje        string    `json:"mensaje"`
	Tiempo         time.Time `json:"tiempo"`
	EmisorNombre   string    `json:"emisor_nombre"`
	EmisorFoto     string    `json:"emisor_foto"`
	ReceptorNombre string    `json:"receptor_nombre"`
	ReceptorFoto   string    `json:"receptor_foto"`
	Archivo        string    `json:"archivo"`
}

type ChatInfo struct {
	PostulationId int       `json:"postulation_id"`
	UserId        string    `json:"user_id"`
	UserName      string    `json:"user_name"`
	UserPhoto     string    `json:"user_photo"`
	LastMessage   string    `json:"last_message"`
	LastTime      time.Time `json:"last_time"`
}

// TableName Esta función se llama automáticamente cuando se hace un Create() en el ORM, acá va el nombre como aparece en Postgres
func (Mensaje) TableName() string {
	return "mensaje"
}

func (MensajeGet) TableName() string {
	return "mensaje"
}

func (ChatInfo) TableName() string {
	return "mensaje"
}
