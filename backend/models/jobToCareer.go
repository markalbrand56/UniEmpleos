package models

// OfertaCarrera es la estructura de la tabla oferta_carrera en la base de datos
type OfertaCarrera struct {
	IdOferta  int `json:"id_oferta"`
	IdCarrera int `json:"id_carrera"`
}

// TableName Esta función se llama automáticamente cuando se hace un Create() en el ORM, acá va el nombre como aparece en Postgres
func (OfertaCarrera) TableName() string {
	return "oferta_carrera"
}
