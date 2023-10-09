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

func TestGetCarreras(t *testing.T) {
	// [GET] /api/careers

	router := setupRouter()
	w := httptest.NewRecorder()

	// login needed to get token
	jsonData := `{"usuario": "estudiante@prueba.com", "contra": "estudianteprueba"}`
	body := bytes.NewBufferString(jsonData)
	req := httptest.NewRequest("POST", "/api/login", body)
	router.ServeHTTP(w, req)

	var loginResponse struct {
		Status  int    `json:"status"`
		Message string `json:"message"`
		Data    struct {
			Role  string `json:"role"`
			Token string `json:"token"`
		}
	}

	err := json.Unmarshal(w.Body.Bytes(), &loginResponse)
	assert.NoError(t, err, "Error unmarshalling login response")

	req2 := httptest.NewRequest("GET", "/api/careers", nil)
	req2.Header.Set("Authorization", "Bearer "+loginResponse.Data.Token)
	router.ServeHTTP(w, req2)

	fmt.Println("************* TEST GET CARRERAS *************")
	fmt.Println(w.Body.String())
	assert.Equal(t, http.StatusOK, w.Code, "Status code is not 200 on new offer")
	fmt.Println("************* Testing Results END *************")

}
