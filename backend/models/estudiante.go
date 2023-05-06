package models

import (
	"time"
)

// Mensaje es la estructura de la tabla estudiante en la base de datos

type estudiante struct {
	IdEstudiante int       `json:"id_estudiante"`
	Dpi          string    `json:"dpi"`
	Nombre       string    `json:"nombre"`
	Apellido     string    `json:"apellido"`
	Nacimiento   time.Time `json:"nacimiento"`
	Telefono     string    `json:"telefono"`
	Carrera      string    `json:"carrera"`
	Semestre     int       `json:"semestre"`
	CV           string    `json:"cv"`
	Foto         string    `json:"foto"`
}

// TableName Esta función se llama automáticamente cuando se hace un Create() en el ORM, acá va el nombre como aparece en Postgres
func (estudiante) TableName() string {
	return "estudiante"
}
