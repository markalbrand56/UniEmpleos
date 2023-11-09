package models

import "time"

type Oferta struct {
	IDEmpresa   string    `json:"id_empresa"`
	Puesto      string    `json:"puesto"`
	Descripcion string    `json:"descripcion"`
	Requisitos  string    `json:"requisitos"`
	Salario     float64   `json:"salario"`
	Jornada     string    `json:"jornada"`
	HoraInicio  time.Time `json:"hora_inicio"`
	HoraFin     time.Time `json:"hora_fin"`
}

// TableName Esta función se llama automáticamente cuando se hace un Create() en el ORM, acá va el nombre como aparece en Postgres
func (Oferta) TableName() string {
	return "oferta"
}

type OfertaGet struct {
	Id_Oferta   int       `json:"id_oferta"`
	IDEmpresa   string    `json:"id_empresa"`
	Puesto      string    `json:"puesto"`
	Descripcion string    `json:"descripcion"`
	Requisitos  string    `json:"requisitos"`
	Salario     float64   `json:"salario"`
	Jornada     string    `json:"jornada"`
	HoraInicio  time.Time `json:"hora_inicio"`
	HoraFin     time.Time `json:"hora_fin"`
}

// TableName Esta función se llama automáticamente cuando se hace un Create() en el ORM, acá va el nombre como aparece en Postgres
func (OfertaGet) TableName() string {
	return "oferta"
}
