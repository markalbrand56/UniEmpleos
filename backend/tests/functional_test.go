package tests

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"
)

type Offer struct {
	ID       int    `json:"id_oferta"`
	Careers  string `json:"nombre_carreras"`
	Company  string `json:"nombre_empresa"`
	Position string `json:"puesto"`
	Salary   int    `json:"salario"`
}

type Postulations struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
	Data    struct {
		Postulations []Offer `json:"postulations"`
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

	assert.Equal(t, http.StatusOK, w.Code, "Status code is not 200")

	var loginResponse struct {
		Status  int    `json:"status"`
		Message string `json:"message"`
		Data    struct {
			Role  string `json:"role"`
			Token string `json:"token"`
		} `json:"data"`
	}

	err := json.Unmarshal(w.Body.Bytes(), &loginResponse)

	assert.NoError(t, err, "Se inició sesión correctamente")

	// Paso 2: Ver todas las ofertas laborales
	// api/postulations/previews

	w = httptest.NewRecorder()
	req = httptest.NewRequest("GET", "/api/postulations/previews", nil)
	router.ServeHTTP(w, req)

	postulations := Postulations{}

	err = json.Unmarshal(w.Body.Bytes(), &postulations)

	assert.Equal(t, http.StatusOK, w.Code, "El usuario puede ver todas las ofertas laborales")

	// Paso 3: Ver información de una oferta laboral
	// api/offers/all

	w = httptest.NewRecorder()
	req = httptest.NewRequest("POST", "/api/offers/all", nil)

	// de la respuesta en postulations, se toma el primer elemento
	id_offer := postulations.Data.Postulations[0].ID
	id_offer_S := strconv.Itoa(id_offer)
	// añadir el token a la cabecera
	jsonOffer := `{"id_oferta": "` + id_offer_S + `"}`
	body = bytes.NewBufferString(jsonOffer)
	req = httptest.NewRequest("POST", "/api/offers/all", body)
	req.Header.Set("Authorization", "Bearer "+loginResponse.Data.Token)

	router.ServeHTTP(w, req)

	fmt.Println(w.Body.String())
	assert.Equal(t, http.StatusOK, w.Code, "El usuario puede ver la información de una oferta laboral")

	// Paso 4: Aplicar a la oferta laboral
	// api/postulations/
	w = httptest.NewRecorder()
	// id_oferta, id_estudiante, estado

	jsonPostulation := `{"id_oferta": ` + id_offer_S + `, "id_estudiante": "alb21004@uvg.edu.gt", "estado": "Enviada"}`

	body = bytes.NewBufferString(jsonPostulation)
	req = httptest.NewRequest("POST", "/api/postulations/", body)

	req.Header.Set("Authorization", "Bearer "+loginResponse.Data.Token)

	router.ServeHTTP(w, req)

	fmt.Println(w.Body.String())

	assert.True(t, w.Code == http.StatusOK || w.Code == http.StatusConflict, w.Code, "El usuario puede aplicar a una oferta laboral")

}

func TestCaseTwo(t *testing.T) {
	/*
		Una empresa quiere "postear" una oferta laboral.
		pasos:
		Iniciar sesión
	*/

	router := setupRouter()
	w := httptest.NewRecorder()

	// Paso 1: Iniciar sesión
	jsonLogin := `{"usuario": "prueba@prueba", "contra": "prueba"}`
	body := bytes.NewBufferString(jsonLogin)
	req := httptest.NewRequest("POST", "/api/login", body)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code, "Status code is not 200")
	var loginResponse struct {
		Status  int    `json:"status"`
		Message string `json:"message"`
		Data    struct {
			Role  string `json:"role"`
			Token string `json:"token"`
		} `json:"data"`
	}

	err := json.Unmarshal(w.Body.Bytes(), &loginResponse)
	assert.NoError(t, err, "Se inició sesión correctamente")

	// Paso 2: Navegar a la pestaña "añadir empleo"
	// api/offers
	w = httptest.NewRecorder()

	// crear el body.
	jsonOffer := `{"id_empresa": "prueba@prueba", "puesto": "FrontEnd Developer", "descripcion": "UX/UI Desing with JS", "requisitos": "Experiencia con JavaScript y Typescript", "salario":100.00, "id_carreras":["1", "2", "3"]}`
	body2 := bytes.NewBufferString(jsonOffer)
	req = httptest.NewRequest("POST", "/api/offers/", body2)

	req.Header.Set("Authorization", "Bearer "+loginResponse.Data.Token)

	router.ServeHTTP(w, req)
	fmt.Println(w.Body.String())

	assert.True(t, w.Code == http.StatusOK || w.Code == http.StatusConflict, w.Code, "El usuario puede añadir una oferta laboral")
	assert.Equal(t, http.StatusOK, w.Code, "El usuario puede añadir una oferta laboral")

}

func TestCaseThree(t *testing.T) {
	/*
		Un estudiante quiere modificar la informacion de su perfil.
	*/

	router := setupRouter()
	w := httptest.NewRecorder()

	// Paso 1: Iniciar sesión
	jsonLogin := `{"usuario": "mor21146@uvg.edu.gt", "contra": "mora"}`
	body := bytes.NewBufferString(jsonLogin)
	req := httptest.NewRequest("POST", "/api/login", body)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code, "Status code is not 200")
	var loginResponse struct {
		Status  int    `json:"status"`
		Message string `json:"message"`
		Data    struct {
			Role  string `json:"role"`
			Token string `json:"token"`
		} `json:"data"`
	}

	err := json.Unmarshal(w.Body.Bytes(), &loginResponse)
	assert.NoError(t, err, "Se inició sesión correctamente")

	// Paso 2: Navegar a la pestaña "Perfil"
	// api/students/update

	w = httptest.NewRecorder()

	// Paso 3: Modificar los campos que se deseen

	// crear el body.
	jsonUpdate := `{"dpi"	    : "3239183600512", 
				"nombre"        : "Diego", 
				"apellido"      : "Morales",
				"nacimiento"    : "2002-10-24", 
				"correo"        : "mor21146@uvg.edu.gt", 
				"telefono"      : "55447788", 
				"carrera"       : 1,   
				"semestre"      : 4,    
				"cv"            : "", 
				"foto"          : "", 
				"contra"		: "mora",
				"universidad"   : "UVG"}`
	body2 := bytes.NewBufferString(jsonUpdate)
	// Paso 4: Guardar los cambios
	req = httptest.NewRequest("PUT", "/api/students/update", body2)

	req.Header.Set("Authorization", "Bearer "+loginResponse.Data.Token)

	router.ServeHTTP(w, req)

	fmt.Println(w.Body.String())

	assert.True(t, w.Code == http.StatusOK || w.Code == http.StatusConflict, w.Code, "El usuario puede editar su perfil")
}
