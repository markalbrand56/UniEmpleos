package models

type Carrera struct {
	IdCarrera   string `json:"id_carrera"`
	Nombre      string `json:"nombre"`
	Descripcion string `json:"descripcion"`
}

// TableName Esta función se llama automáticamente cuando se hace un Create() en el ORM, acá va el nombre como aparece en Postgres
func (Carrera) TableName() string {
	return "carrera"
}
