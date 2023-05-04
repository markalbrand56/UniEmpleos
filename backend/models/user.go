package models

type Usuario struct {
	Usuario    string `json:"usuario"`
	Contra     string `json:"contra"`
	Suspendido bool   `json:"suspendido"`
}

func (Usuario) TableName() string {
	return "usuario"
}
