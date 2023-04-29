package routes

import (
	"backend/controller"
	"github.com/gin-gonic/gin"
)

func Routes(router *gin.Engine) {
	router.POST("/upload", controller.UploadFile())
}
