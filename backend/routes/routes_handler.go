package routes

import (
	"backend/controllers"
	"backend/middlewares"
	"github.com/gin-gonic/gin"
)

func Routes(router *gin.Engine) {
	// Rutas públicas
	public := router.Group("/api")

	public.POST("/login", controllers.Login)
	public.POST("/students", controllers.NewStudent)
	public.POST("/companies", controllers.NewCompany)
	public.GET("/postulations/previews", controllers.GetOfferPreviews)

	// Rutas de archivos
	public.GET("/uploads/:filename", controllers.GetProfilePicture())
	public.GET("cv/:filename", controllers.GetCV())

	// Rutas protegidas
	// Mensajes
	messages := router.Group("api/messages")
	messages.Use(middlewares.JwtAuthentication())

	messages.POST("/send", controllers.SendMessage)
	messages.POST("/get", controllers.GetMessages)
	messages.POST("/getLast", controllers.GetLastChat)
	messages.DELETE("/delete", controllers.DeleteChat)

	// Usuarios
	users := router.Group("api/users")
	users.Use(middlewares.JwtAuthentication())

	users.GET("/", controllers.GetCurrentUserDetails)
	users.POST("/details", controllers.GetUserDetails)
	users.PUT("/upload", controllers.UpdateProfilePicture())

	// Estudiantes
	students := router.Group("api/students")
	students.Use(middlewares.JwtAuthentication())

	students.PUT("/update", controllers.UpdateStudent)
	students.PUT("/update/cv", controllers.UpdateCV())

	// Carreras
	careers := router.Group("api/careers")
	careers.Use(middlewares.JwtAuthentication())

	careers.POST("/", controllers.NewCareer)
	public.GET("/careers", controllers.GetCareers)

	// Empresas
	companies := router.Group("api/companies")
	companies.Use(middlewares.JwtAuthentication())
	companies.PUT("/update", controllers.UpdateCompanies)

	// Administradores
	admins := router.Group("api/admins")
	admins.Use(middlewares.JwtAuthentication())

	admins.GET("/students", controllers.AdminGetStudents)
	admins.GET("/companies", controllers.AdminGetCompanies)
	admins.POST("/suspend", controllers.AdminSuspendAccount)
	admins.DELETE("/delete/offers", controllers.AdminDeleteOffer)
	admins.POST("/delete/user", controllers.AdminDeleteUser)
	admins.DELETE("/postulation", controllers.AdminDeletePostulation)
	admins.POST("/details", controllers.AdminGetUserDetails)
	admins.POST("/postulations", controllers.GetPostulationsOfStudentAsAdmin)

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
	postulations.GET("/getFromStudent", controllers.GetPostulationFromStudent)
	postulations.DELETE("/", controllers.RetirePostulation)
}
