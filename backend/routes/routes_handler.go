package routes

import (
	"backend/controllers"
	"backend/middlewares"
	"github.com/gin-gonic/gin"
)

func Routes(router *gin.Engine) {
	router.POST("/register", controllers.Register)
	router.POST("/login", controllers.Login)

	router.POST("/upload", controllers.UploadFile())

	// Rutas protegidas
	// Mensajes
	messages := router.Group("/messages")
	messages.Use(middlewares.JwtAuthentication())

	messages.POST("/send", controllers.SendMessage)

	// Usuarios
	users := router.Group("/users")
	users.Use(middlewares.JwtAuthentication())

	users.GET("/", controllers.CurrentUser)
}
