package main

import (
	"backend/configs"
	"backend/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	//config := cors.DefaultConfig()

	//config.AllowAllOrigins = true
	//config.AddAllowHeaders("Authorization")
	//config.AddAllowHeaders("Access-Control-Allow-Origin")
	//config.AddAllowMethods("OPTIONS") // Agregar OPTIONS como método permitido

	//router.Use(cors.New(config))

	router.Use(CORS())

	routes.Routes(router)
	configs.SetupDB()

	router.Run(":8080")
}

func CORS() gin.HandlerFunc {
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
