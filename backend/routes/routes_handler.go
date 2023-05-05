package routes

import (
	"backend/controllers"
	"github.com/gin-gonic/gin"
)

func Routes(router *gin.Engine) {
	router.POST("/upload", controllers.UploadFile())
	router.POST("/register", controllers.Register)
	router.POST("/login", controllers.Login)
	router.POST("/chat", controllers.SendMessage)
}
