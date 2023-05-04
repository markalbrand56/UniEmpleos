package models

import "time"

type Mensaje struct {
	//ID_mensaje     int       `json:"id_mensaje"`  // Al ser serial, no es necesario especificarlo
	IdPostulacion int       `json:"id_postulacion"`
	IdEmisor      string    `json:"id_emisor"`
	IdReceptor    string    `json:"id_receptor"`
	Mensaje       string    `json:"mensaje"`
	Tiempo        time.Time `json:"tiempo"`
}

func (Mensaje) TableName() string {
	return "mensaje"
}
