package models

type Oferta struct {
	IDempresa   string `json:"id_empresa"`
	Puesto      string `json:"puesto"`
	Descripcion string `json:"descripcion"`
	Requisitos  string `json:"requisitos"`
}

// TableName Esta función se llama automáticamente cuando se hace un Create() en el ORM, acá va el nombre como aparece en Postgres
func (Oferta) TableName() string {
	return "oferta"
}
