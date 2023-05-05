package routes

import (
	"backend/controllers"
	"backend/middlewares"
	"github.com/gin-gonic/gin"
)

func Routes(router *gin.Engine) {
	router.POST("/upload", controllers.UploadFile())
	router.POST("/register", controllers.Register)
	router.POST("/login", controllers.Login)

	messages := router.Group("/messages")
	messages.Use(middlewares.JwtAuthentication())

	messages.POST("/send", controllers.SendMessage)
}
