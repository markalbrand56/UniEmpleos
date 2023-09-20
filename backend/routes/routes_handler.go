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
	public.GET("/postulations/previews", controllers.GetOfferPreviews)

	// Rutas de archivos
	public.POST("/upload", controllers.UploadFile())
	public.GET("/uploads/:filename", controllers.GetFile())

	// Rutas protegidas
	// Mensajes
	messages := router.Group("api/messages")
	messages.Use(middlewares.JwtAuthentication())

	messages.POST("/send", controllers.SendMessage)
	messages.POST("/get", controllers.GetMessages)
	messages.POST("/getLast", controllers.GetLastChat)

	// Usuarios
	users := router.Group("api/users")
	users.Use(middlewares.JwtAuthentication())

	users.GET("/", controllers.CurrentUser)
	users.POST("/details", controllers.GetUserDetails)

	// Estudiantes
	students := router.Group("api/students")
	students.Use(middlewares.JwtAuthentication())

	students.PUT("/update", controllers.UpdateStudent)

	// Carreras
	careers := router.Group("api/careers")
	careers.Use(middlewares.JwtAuthentication())

	careers.POST("/", controllers.NewCareer)
	public.GET("/careers", controllers.GetCareers)

	// Empresas
	// Ale: Use "company" porque el mamark quería que fuera en inglés :)
	companies := router.Group("api/companies")
	companies.Use(middlewares.JwtAuthentication())

	companies.PUT("/update", controllers.UpdateCompanies)

	// Administradores
	admins := router.Group("api/admins")
	admins.Use(middlewares.JwtAuthentication())

	admins.POST("/", controllers.NewAdmin)
	admins.GET("/students", controllers.GetStudents)
	admins.GET("/companies", controllers.GetCompanies)
	admins.POST("/suspend", controllers.SuspendAccount)

	// Ofertas
	offers := router.Group("api/offers")
	offers.Use(middlewares.JwtAuthentication())

	offers.POST("/", controllers.NewOffer)
	offers.PUT("/", controllers.UpdateOffer)
	offers.POST("/all", controllers.GetOffer)
	offers.POST("/company", controllers.GetOfferByCompany)
	offers.DELETE("/", controllers.DeleteOffer)
	offers.POST("/applicants", controllers.GetApplicants)

	// Postulaciones
	postulations := router.Group("api/postulations")
	postulations.Use(middlewares.JwtAuthentication())

	postulations.POST("/", controllers.NewPostulation)
}
