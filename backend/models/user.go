package models

// Usuario es la estructura de la tabla usuario en la base de datos
type Usuario struct {
	Usuario    string `json:"usuario"`
	Contra     string `json:"contra"`
	Suspendido bool   `json:"suspendido"`
}

// TableName Esta función se llama automáticamente cuando se hace un Create() en el ORM, acá va el nombre como aparece en Postgres
func (Usuario) TableName() string {
	return "usuario"
}
