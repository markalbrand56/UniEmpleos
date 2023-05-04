package routes

import (
	"backend/controllers"
	"github.com/gin-gonic/gin"
)

func Routes(router *gin.Engine) {
	router.POST("/upload", controllers.UploadFile())
	router.POST("/register", controllers.Register)
}
