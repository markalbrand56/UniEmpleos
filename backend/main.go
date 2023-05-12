package main

import (
	"backend/configs"
	"backend/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	routes.Routes(router)
	configs.SetupDB()

	router.Run(":8080")
}
