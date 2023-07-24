package models

type Postulacion struct {
	IdOferta     int    `json:"id_oferta"`
	IdEstudiante string `json:"id_estudiante"`
	Estado       string `json:"estado"`
}

// TableName Esta función se llama automáticamente cuando se hace un Create() en el ORM, acá va el nombre como aparece en Postgres
func (Postulacion) TableName() string {
	return "postulacion"
}

type PostulacionGet struct {
	IdPostulacion int    `json:"id_postulacion"`
	IdOferta      int    `json:"id_oferta"`
	IdEstudiante  string `json:"id_estudiante"`
	Estado        string `json:"estado"`
}

type PostulacionGetAll struct {
	IdEstudiante string `json:"id_estudiante"`
	Estado       string `json:"estado"`
}

// TableName Esta función se llama automáticamente cuando se hace un Create() en el ORM, acá va el nombre como aparece en Postgres
func (PostulacionGet) TableName() string {
	return "postulacion"
}
