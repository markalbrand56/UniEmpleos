package models

import "time"

type ViewPrevPostulaciones struct {
	IdOferta      int       `json:"id_oferta"`
	Puesto        string    `json:"puesto"`
	NombreEmpresa string    `json:"nombre_empresa"`
	NombreCarrera string    `json:"nombre_carrera"`
	Salario       float64   `json:"salario"`
	Jornada       string    `json:"jornada"`
	HoraInicio    time.Time `json:"hora_inicio"`
	HoraFin       time.Time `json:"hora_fin"`
}

func (ViewPrevPostulaciones) TableName() string {
	return "prev_postulaciones"
}
