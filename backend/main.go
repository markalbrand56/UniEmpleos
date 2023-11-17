package main

import (
	"backend/configs"
	"backend/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	// create directory for profile pictures
	if _, err := configs.CreateDirIfNotExist("./uploads"); err != nil {
		panic(err)
	}

	// create directory for pdf files
	if _, err := configs.CreateDirIfNotExist("./uploads/pdf"); err != nil {
		panic(err)
	}

	router := gin.Default()

	router.Use(CORS())

	routes.Routes(router)
	configs.SetupDB()

	err := router.Run(":8080")
	if err != nil {
		return
	}
}

// CORS permite el acceso a la API desde cualquier origen
func CORS() gin.HandlerFunc {
	// Reference: https://github.com/gin-contrib/cors/issues/29
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
