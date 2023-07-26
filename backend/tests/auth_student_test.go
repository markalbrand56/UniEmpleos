package tests

import (
	"backend/configs"
	"backend/routes"
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
)

func setupRouter() *gin.Engine {
	router := gin.Default()
	router.Use(CORS())
	routes.Routes(router)
	configs.SetupDB()

	return router
}

func CORS() gin.HandlerFunc {
	// Reference: https://github.com/gin-contrib/cors/issues/29
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func TestLogin(t *testing.T) {
	router := setupRouter()

	w := httptest.NewRecorder()
	// usuario: mor21246@uvg
	// contraseña: mora
	jsonData := `{"usuario": "prueba@prueba", "contra": "prueba"}`

	body := bytes.NewBufferString(jsonData)

	req := httptest.NewRequest("POST", "/api/login", body)

	router.ServeHTTP(w, req)

	fmt.Println(w.Body.String())
	// Comprueba la respuesta HTTP y el cuerpo de la respuesta
	assert.Equal(t, http.StatusOK, w.Code, "Status code is not 200")
}

func TestNewStudent(t *testing.T) {
	router := setupRouter()

	w := httptest.NewRecorder()

	jsonData := `{"dpi": "101010101010", "nombre": "Juan", "apellido": "Perez", "nacimiento": "19/05/2002", "correo": "juan@prueba.com", "telefono": "55555555", "carrera": 1, "semestre": 4, "contra": "12345678", "CV": "", "foto": "", "universidad": "Universidad del Valle de Guatemala"}`

	body := bytes.NewBufferString(jsonData)

	req := httptest.NewRequest("POST", "/api/students", body)

	router.ServeHTTP(w, req)

	fmt.Println(w.Body.String())

	assert.Equal(t, http.StatusOK, w.Code, "Status code is not 200")
}

func TestUpdateStudent(t *testing.T) {
	// Paso 1: Realizar la solicitud de inicio de sesión para obtener el token
	router := setupRouter()

	w := httptest.NewRecorder()
	jsonData := `{"usuario": "prueba@prueba", "contra": "prueba"}` // Solo para obtener el token
	body := bytes.NewBufferString(jsonData)

	req := httptest.NewRequest("POST", "/api/login", body)

	router.ServeHTTP(w, req)

	// Comprueba la respuesta HTTP y el cuerpo de la respuesta
	assert.Equal(t, http.StatusOK, w.Code, "Status code is not 200")

	// Paso 2: Extraer el token de la respuesta
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

	// Paso 3: Usar el token para hacer la actualización del estudiante
	w = httptest.NewRecorder()

	jsonData = `{"dpi": "101010101010", "nombre": "Juan", "apellido": "Perez", "nacimiento": "19/05/2002", "correo": "juan@prueba.com", "telefono": "666666", "carrera": 1, "semestre": 4, "contra": "12345678", "CV": "", "foto": "", "universidad": "Universidad del Valle de Guatemala"}`
	body = bytes.NewBufferString(jsonData)

	req = httptest.NewRequest("PUT", "/api/students/update", body)
	req.Header.Set("Authorization", "Bearer "+loginResponse.Data.Token)

	router.ServeHTTP(w, req)

	fmt.Println(w.Body.String())

	assert.Equal(t, http.StatusOK, w.Code, "Status code is not 200 on update student")
}
