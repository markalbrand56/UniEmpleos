package models

type Administrador struct {
	IdAdmin  string `json:"id_admin"`
	Nombre   string `json:"nombre"`
	Apellido string `json:"apellido"`
}

func (Administrador) TableName() string {
	return "administrador"
}
