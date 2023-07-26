package models

import "time"

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
	ID_mensaje int       `json:"id_mensaje"`
	IdEmisor   string    `json:"id_emisor"`
	IdReceptor string    `json:"id_receptor"`
	Mensaje    string    `json:"mensaje"`
	Tiempo     time.Time `json:"tiempo"`
}

// TableName Esta función se llama automáticamente cuando se hace un Create() en el ORM, acá va el nombre como aparece en Postgres
func (Mensaje) TableName() string {
	return "mensaje"
}

func (MensajeGet) TableName() string {
	return "mensaje"
}
