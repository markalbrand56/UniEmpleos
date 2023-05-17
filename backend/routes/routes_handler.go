package routes

import (
	"backend/controllers"
	"backend/middlewares"
	"github.com/gin-gonic/gin"
)

func Routes(router *gin.Engine) {
	// Rutas públicas
	public := router.Group("/api")

	public.POST("/register", controllers.Register)
	public.POST("/login", controllers.Login)
	public.POST("/students", controllers.NewStudent)
	public.POST("/companies", controllers.NewCompany)

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

	// Carreras
	careers := router.Group("api/careers")
	careers.Use(middlewares.JwtAuthentication())

	careers.POST("/", controllers.NewCarrer)

	// Empresas
	// Ale: Use "company" porque el mamark quería que fuera en inglés :)
	companies := router.Group("api/companies")
	companies.Use(middlewares.JwtAuthentication())

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
