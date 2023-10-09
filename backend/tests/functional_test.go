package tests

import (
	"backend/configs"
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
	jsonLogin := `{"usuario": "estudiante@prueba.com", "contra": "estudianteprueba"}`

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

	jsonPostulation := `{"id_oferta": ` + id_offer_S + `, "id_estudiante": "estudiante@prueba.com", "estado": "Enviada"}`

	body = bytes.NewBufferString(jsonPostulation)
	req = httptest.NewRequest("POST", "/api/postulations/", body)

	req.Header.Set("Authorization", "Bearer "+loginResponse.Data.Token)

	router.ServeHTTP(w, req)

	fmt.Println(w.Body.String())

	assert.True(t, w.Code == http.StatusOK || w.Code == http.StatusConflict, w.Code, "El usuario puede aplicar a una oferta laboral")

}

func TestCaseTwo(t *testing.T) { // ESTEE
	/*
		Una empresa quiere "postear" una oferta laboral.
		pasos:
		Iniciar sesión
	*/

	router := setupRouter()
	w := httptest.NewRecorder()

	// Paso 1: Iniciar sesión
	jsonLogin := `{"usuario": "empresa@prueba.com", "contra": "empresaprueba"}`
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
	jsonOffer := `{"id_empresa": "empresa@prueba.com", "puesto": "Puesto de Prueba TC2", "descripcion": "Descripcion de Prueba", "requisitos": "Experiencia de Prueba", "salario":100.00, "id_carreras":["1", "2", "3"]}`
	body2 := bytes.NewBufferString(jsonOffer)
	req = httptest.NewRequest("POST", "/api/offers/", body2)

	req.Header.Set("Authorization", "Bearer "+loginResponse.Data.Token)

	router.ServeHTTP(w, req)
	fmt.Println(w.Body.String())

	assert.True(t, w.Code == http.StatusOK || w.Code == http.StatusConflict, w.Code, "El usuario puede añadir una oferta laboral")
	assert.Equal(t, http.StatusOK, w.Code, "El usuario puede añadir una oferta laboral")

	// eliminar con un query la oferta que se acaba de crear.

	//configs.DB.Where("puesto = 'Puesto de Prueba TC2'").Delete(&Offer{})
	//configs.DB.Raw("DELETE FROM oferta WHERE puesto = 'Puesto de Prueba TC2'").Scan(&Offer{})

}

func TestCaseThree(t *testing.T) {
	/*
		Un estudiante quiere modificar la informacion de su perfil.
	*/

	router := setupRouter()
	w := httptest.NewRecorder()

	// Paso 1: Iniciar sesión
	jsonLogin := `{"usuario": "estudiante@prueba.com", "contra": "estudianteprueba"}`
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
	jsonUpdate := `{"dpi"	    : "101010101010", 
				"nombre"        : "Estudiante Actualizado", 
				"apellido"      : "Prueba",
				"nacimiento"    : "2002-02-02", 
				"correo"        : "estudiante@prueba.com", 
				"telefono"      : "12345678", 
				"carrera"       : 1,   
				"semestre"      : 4,    
				"cv"            : "", 
				"foto"          : "", 
				"contra"		: "estudianteprueba",
				"universidad"   : "Universidad Del Valle de Guatemala"}`
	body2 := bytes.NewBufferString(jsonUpdate)
	// Paso 4: Guardar los cambios
	req = httptest.NewRequest("PUT", "/api/students/update", body2)

	req.Header.Set("Authorization", "Bearer "+loginResponse.Data.Token)

	router.ServeHTTP(w, req)

	fmt.Println(w.Body.String())

	assert.True(t, w.Code == http.StatusOK || w.Code == http.StatusConflict, w.Code, "El usuario puede editar su perfil")
	configs.DB.Raw("DELETE FROM oferta WHERE puesto = 'Puesto de Prueba TC2'").Scan(&Offer{})
	configs.DB.Raw("DELETE FROM postulacion WHERE id_estudiante = 'estudiante@prueba.com'").Scan(&Postulations{})

}
