package tests

import (
	"backend/configs"
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestNewOffer(t *testing.T) {
	// api/offers/
	// Create a new offer.

	router := setupRouter()
	w := httptest.NewRecorder()

	jsonData := `{"usuario": "empresa@prueba.com", "contra": "empresaprueba"}`
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

	jsonData2 := `{"id_empresa":"empresa@prueba.com", "puesto":"puesto prueba JSJSJS", "descripcion":"descripcion prueba", "requisitos":"requisitos prueba", "salario":1000.00, "id_carreras":["1", "2", "3"]}`
	body2 := bytes.NewBufferString(jsonData2)
	req2 := httptest.NewRequest("POST", "/api/offers/", body2)
	req2.Header.Set("Authorization", "Bearer "+loginResponse.Data.Token)

	router.ServeHTTP(w, req2)

	fmt.Println("************* Creating a new Offer *************")
	fmt.Println(w.Body.String())
	assert.Equal(t, http.StatusOK, w.Code, "Status code is not 200 on new offer")
	fmt.Println("************* Testing Results END *************")

	// eliminar la oferta que acabo de hacer.
	configs.DB.Raw("DELETE FROM oferta WHERE puesto = 'puesto prueba JSJSJS'").Scan(&loginResponse)

}

func TestGetOffer(t *testing.T) {
	// api/offers/all
	// Get a specific offer.

	// setting up router
	router := setupRouter()
	w := httptest.NewRecorder()

	// Login needed to get token
	jsonData := `{"usuario": "empresa@prueba.com", "contra": "empresaprueba"}`
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

	jsonData2 := `{"id_oferta":"330"}`
	body2 := bytes.NewBufferString(jsonData2)
	req2 := httptest.NewRequest("POST", "/api/offers/all", body2)
	req2.Header.Set("Authorization", "Bearer "+loginResponse.Data.Token)
	router.ServeHTTP(w, req2)

	fmt.Println("************* TEST GET OFFER *************")
	fmt.Println(w.Body.String())
	assert.Equal(t, http.StatusOK, w.Code, "Status code is not 200 on new offer")
	fmt.Println("************* Testing Results END *************")
}

func TestCompanyOffers(t *testing.T) {
	// api/offers/company
	// All the offers a company has made.

	router := setupRouter()
	w := httptest.NewRecorder()

	// Login needed to get token
	jsonData := `{"usuario": "empresa@prueba.com", "contra": "empresaprueba"}`
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

	jsonData2 := `{"id_empresa": "reclutamiento@sarita.com"}`
	body2 := bytes.NewBufferString(jsonData2)
	req2 := httptest.NewRequest("POST", "/api/offers/company", body2)
	req2.Header.Set("Authorization", "Bearer "+loginResponse.Data.Token)
	router.ServeHTTP(w, req2)

	fmt.Println("************* Test All the Offers of a company *************")
	fmt.Println(w.Body.String())
	assert.Equal(t, http.StatusOK, w.Code, "Status code is not 200 on new offer")
	fmt.Println("************* Testing Results END *************")
}
