package tests

import (
	"backend/controllers"
	"bytes"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestRegister(t *testing.T) {
	// Crea una solicitud HTTP POST simulada con un JSON válido
	jsonData := `{"Usuario": "nuevo_usuario", "Contra": "password123"}`
	req, err := http.NewRequest("POST", "/register", bytes.NewBufferString(jsonData))
	if err != nil {
		t.Fatal(err)
	}

	// Configura el contexto de Gin con un ResponseRecorder para capturar la respuesta
	rr := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(rr)
	ctx.Request = req

	// Ejecuta la función Register
	controllers.Register(ctx)

	// Comprueba la respuesta HTTP y el cuerpo de la respuesta
	assert.Equal(t, http.StatusOK, rr.Code, "Status code is not 200")
	assert.JSONEq(t, `{"Status":200,"Message":"Usuario created successfully","Data":null}`, rr.Body.String(), "Response body does not match expected")

	// También puedes agregar pruebas adicionales para verificar la lógica dentro de la función Register.
	// Por ejemplo, podrías comprobar si el usuario se guardó correctamente en la base de datos.
}
