package models

type Empresa struct {
	IdEmpresa string `json:"id_empresa"`
	Nombre    string `json:"nombre"`
	Foto      string `json:"foto"`
	Detalles  string `json:"detalles"`
	Correo    string `json:"correo"`
	Telefono  string `json:"telefono"`
}

func (Empresa) TableName() string {
	return "empresa"
}
