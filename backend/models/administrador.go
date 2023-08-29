package models

type Administrador struct {
	IdAdministrador string `json:"id_administrador"`
	Nombre          string `json:"nombre"`
	Apellido        string `json:"apellido"`
}

type EstudianteGetAdmin struct {
	IdEstudiante string `json:"id_estudiante"`
	Foto         string `json:"foto"`
	Nombre       string `json:"nombre"`
	Apellido     string `json:"apellido"`
	Nacimiento   string `json:"nacimiento"`
	Suspendido   bool   `json:"suspendido"`
}

func (Administrador) TableName() string {
	return "administrador"
}

func (EstudianteGetAdmin) TableName() string {
	return "EstudianteGetAdmin"
}
