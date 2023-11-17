package models

type Carrera struct {
	Nombre      string `json:"nombre"`
	Descripcion string `json:"descripcion"`
}

// TableName Esta función se llama automáticamente cuando se hace un Create() en el ORM, acá va el nombre como aparece en Postgres
func (Carrera) TableName() string {
	return "carrera"
}

// CarreraGet es la estructura de la tabla carrera en la base de datos
type CarreraGet struct {
	Id_Carrera  int    `json:"id_carrera"`
	Nombre      string `json:"nombre"`
	Descripcion string `json:"descripcion"`
}

// TableName Esta función se llama automáticamente cuando se hace un Create() en el ORM, acá va el nombre como aparece en Postgres
func (CarreraGet) TableName() string {
	return "carrera"
}
