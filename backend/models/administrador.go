package models

type Administrador struct {
	IdAdministrador string `json:"id_administrador"`
	Nombre          string `json:"nombre"`
	Apellido        string `json:"apellido"`
}

func (Administrador) TableName() string {
	return "administrador"
}
