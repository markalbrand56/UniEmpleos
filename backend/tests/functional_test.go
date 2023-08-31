package tests

import (
	"bytes"
	"encoding/json"
	"github.com/stretchr/testify/assert"
	"net/http/httptest"
	"testing"
)

type LoginResponse struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
	Data    struct {
		Role  string `json:"role"`
		Token string `json:"token"`
	} `json:"data"`
}

func TestCaseOne(t *testing.T) {
	/*
		Caso 1:	Un estudiante quiere aplicar a una oferta laboral.

		Pasos:
		Iniciar sesión
		Ver todas las ofertas laborales
		Ver información de una oferta laboral
		Aplicar a la oferta laboral

	*/

	router := setupRouter()
	w := httptest.NewRecorder()

	// Paso 1: Iniciar sesión
	jsonLogin := `{"usuario": "alb21004@uvg.edu.gt", "contra": "mark"}`

	body := bytes.NewBufferString(jsonLogin)
	req := httptest.NewRequest("POST", "/api/login", body)
	router.ServeHTTP(w, req)

	login := LoginResponse{}

	err := json.Unmarshal(w.Body.Bytes(), &login)

	assert.NoError(t, err, "Error while logging in. "+err.Error())
}
