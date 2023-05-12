package routes

import (
	"backend/controllers"
	"backend/middlewares"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Routes(router *gin.Engine) {
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:8080"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			for _, allowedOrigin := range []string{"http://localhost:3000", "http://localhost:8080"} {
				if allowedOrigin == origin {
					return true
				}
			}
			return false
		},
	}))
	// Rutas públicas
	public := router.Group("/api")

	public.POST("/register", controllers.Register)
	public.POST("/login", controllers.Login)

	router.POST("/upload", controllers.UploadFile())

	// Rutas protegidas
	// Mensajes
	messages := router.Group("api/messages")
	messages.Use(middlewares.JwtAuthentication())

	messages.POST("/send", controllers.SendMessage)

	// Usuarios
	users := router.Group("api/users")
	users.Use(middlewares.JwtAuthentication())

	users.GET("/", controllers.CurrentUser)

	// Estudiantes
	students := router.Group("api/students")
	students.Use(middlewares.JwtAuthentication())

	students.POST("/", controllers.NewStudent)

	// Carreras
	careers := router.Group("api/careers")
	careers.Use(middlewares.JwtAuthentication())

	careers.POST("/", controllers.NewCarrer)

	// Empresas
	// Ale: Use "company" porque el mamark quería que fuera en inglés :)
	companies := router.Group("api/companies")
	companies.Use(middlewares.JwtAuthentication())

	companies.POST("/", controllers.NewCompany)

	// Administradores
	admins := router.Group("api/admins")
	admins.Use(middlewares.JwtAuthentication())

	admins.POST("/", controllers.NewAdmin)

	// Ofertas
	offers := router.Group("api/offers")
	offers.Use(middlewares.JwtAuthentication())

	offers.POST("/", controllers.NewOffer)

	// Postulaciones
	postulations := router.Group("api/postulations")
	postulations.Use(middlewares.JwtAuthentication())

	postulations.POST("/", controllers.NewPostulation)
}
