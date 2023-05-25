package main

import (
	"backend/configs"
	"backend/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// Configurar el middleware CORS
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AddAllowHeaders("Authorization")
	config.AddAllowMethods("OPTIONS") // Agregar OPTIONS como método permitido
	router.Use(cors.New(config))

	routes.Routes(router)
	configs.SetupDB()

	router.OPTIONS("/*any", func(c *gin.Context) {}) // Agregar OPTIONS como método permitido

	router.Run(":8080")
}
