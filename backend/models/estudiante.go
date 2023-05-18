package models

import (
	"time"
)

// Mensaje es la estructura de la tabla estudiante en la base de datos

type Estudiante struct {
	IdEstudiante string    `json:"id_estudiante"`
	Dpi          string    `json:"dpi"`
	Nombre       string    `json:"nombre"`
	Apellido     string    `json:"apellido"`
	Nacimiento   time.Time `json:"nacimiento"`
	Correo       string    `json:"correo"`
	Telefono     string    `json:"telefono"`
	Carrera      int       `json:"carrera"`
	Semestre     int       `json:"semestre"`
	CV           string    `json:"cv"`
	Foto         string    `json:"foto"`
	Universidad  string    `json:"universidad"`
}

// TableName Esta función se llama automáticamente cuando se hace un Create() en el ORM, acá va el nombre como aparece en Postgres
func (Estudiante) TableName() string {
	return "estudiante"
}
