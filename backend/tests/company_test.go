package tests

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestUpdateCompany(t *testing.T) {
	router := setupRouter()
	w := httptest.NewRecorder()

	// Login needed to get token
	jsonDataPrev := `{"usuario": "reclutamiento@sarita.com", "contra": "sarita"}`
	bodyPrev := bytes.NewBufferString(jsonDataPrev)
	reqPrev := httptest.NewRequest("POST", "/api/login", bodyPrev)
	router.ServeHTTP(w, reqPrev)

	var loginResponse struct {
		Status  int    `json:"status"`
		Message string `json:"message"`
		Data    struct {
			Role  string `json:"role"`
			Token string `json:"token"`
		} `json:"data"`
	}

	err := json.Unmarshal(w.Body.Bytes(), &loginResponse)
	assert.NoError(t, err, "Error unmarshalling login response")

	jsonData := `{"nombre": "Sarita SA", "detalles": "Dummy 2", "correo": "reclutamiento@sarita.com", "telefono": "22227314", "contra": "sarita"}`
	body := bytes.NewBufferString(jsonData)
	req := httptest.NewRequest("PUT", "/api/companies/update", body)
	req.Header.Set("Authorization", "Bearer "+loginResponse.Data.Token)
	router.ServeHTTP(w, req)

	fmt.Println("************* Testing Results START *************")
	fmt.Println(w.Body.String())
	assert.Equal(t, http.StatusOK, w.Code, "Status code is not 200 on update student")
	fmt.Println("************* Testing Results END *************")

}
