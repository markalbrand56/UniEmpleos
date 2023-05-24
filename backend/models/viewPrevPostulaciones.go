package models

type ViewPrevPostulaciones struct {
	IdOferta      int     `json:"id_oferta"`
	Puesto        string  `json:"puesto"`
	NombreEmpresa string  `json:"nombre_empresa"`
	NombreCarrera string  `json:"nombre_carrera"`
	Salario       float64 `json:"salario"`
}

func (ViewPrevPostulaciones) TableName() string {
	return "prev_postulaciones"
}
