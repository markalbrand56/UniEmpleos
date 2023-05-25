package main

import (
	"backend/configs"
	"backend/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.Use(cors.Default())

	routes.Routes(router)
	configs.SetupDB()

	router.Run(":8080")
}
