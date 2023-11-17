package models

import (
	"backend/configs"
	"errors"
	"golang.org/x/crypto/bcrypt"
	"html"
	"strings"
)

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

// SaveUser guarda un usuario en la base de datos
func (u *Usuario) SaveUser() (*Usuario, error) {
	err := configs.DB.Create(&u).Error

	if err != nil {
		return &Usuario{}, err
	}

	return u, nil
}

// BeforeSave se llama antes de guardar un usuario en la base de datos, se encripta la contraseña
func (u *Usuario) BeforeSave() error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Contra), bcrypt.DefaultCost)

	if err != nil {
		return err
	}

	u.Contra = string(hashedPassword)
	u.Usuario = html.EscapeString(strings.TrimSpace(u.Usuario))

	return nil
}

// GetUserByUsername busca un usuario por su nombre de usuario
func GetUserByUsername(username string) (Usuario, error) {
	var user Usuario

	err := configs.DB.Where("usuario = ?", username).First(&user).Error

	if err != nil {
		return Usuario{}, errors.New("user not found")
	}

	user.Contra = "" // no queremos que se devuelva la contraseña

	return user, nil
}
