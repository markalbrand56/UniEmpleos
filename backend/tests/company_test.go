package tests

import (
	"bytes"
	"fmt"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestUpdateCompany(t *testing.T) {
	router := setupRouter()
	w := httptest.NewRecorder()
	r := httptest.NewRecorder()

	// Login needed to get token
	jsonDataPrev := `{"usuario": "reclutamiento@sarita.com", "contra": "sarita"}`
	bodyPrev := bytes.NewBufferString(jsonDataPrev)
	reqPrev := httptest.NewRequest("POST", "/api/login", bodyPrev)
	router.ServeHTTP(r, reqPrev)

	// var token = r.Body.buf

	jsonData := `{"nombre": "Sarita SA", "detalles": "Dummy 2", "correo": "reclutamiento@sarita.com", "telefono": "22227314", "contra": "sarita"}`
	body := bytes.NewBufferString(jsonData)
	req := httptest.NewRequest("PUT", "/api/companies/update", body)
	router.ServeHTTP(w, req)

	fmt.Println(w.Body.String())
	fmt.Println(r.Body.String())
	// Comprueba la respuesta HTTP y el cuerpo de la respuesta
	assert.Equal(t, http.StatusOK, w.Code, "Status code is not 200")
}
