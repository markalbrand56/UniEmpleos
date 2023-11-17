package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"backend/utils"
	"database/sql"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"time"
)

// Offer as they arrive from frontend
type OfferInput struct {
	IDEmpresa   string    `json:"id_empresa"`
	Puesto      string    `json:"puesto"`
	Descripcion string    `json:"descripcion"`
	Requisitos  string    `json:"requisitos"`
	Salario     float64   `json:"salario"`
	IdCarreras  []string  `json:"id_carreras"`
	Jornada     string    `json:"jornada"`
	HoraInicio  time.Time `json:"hora_inicio"`
	HoraFin     time.Time `json:"hora_fin"`
}

// Processing offer (backend)
type AfterInsert struct {
	IdOferta    int       `json:"id_oferta"`
	IDEmpresa   string    `json:"id_empresa"`
	Puesto      string    `json:"puesto"`
	Descripcion string    `json:"descripcion"`
	Requisitos  string    `json:"requisitos"`
	Salario     float64   `json:"salario"`
	Jornada     string    `json:"jornada"`
	HoraInicio  time.Time `json:"hora_inicio"`
	HoraFin     time.Time `json:"hora_fin"`
}

// Processing offer_carrera (backend)
type AfterInsert2 struct {
	IdOferta  int `json:"id_oferta"`
	IdCarrera int `json:"id_carrera"`
}

// Creates a new offer in the database
func NewOffer(c *gin.Context) {
	var input OfferInput

	if err := c.BindJSON(&input); err != nil { // If the input is not valid, return an error
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid input: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// extract the username from the token
	user, err := utils.TokenExtractUsername(c)

	if err != nil { // If the token is not valid, return an error
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error extracting information from token: " + err.Error(),
			Data:    nil,
		})
		return
	}

	if user != input.IDEmpresa { // If the user in the token does not match the one in the request body, return an error
		c.JSON(http.StatusForbidden, responses.StandardResponse{
			Status:  http.StatusForbidden,
			Message: "The user in the token does not match the one in the request body",
			Data:    nil,
		})
		return
	}

	// Create the offer object
	offer := models.Oferta{
		IDEmpresa:   input.IDEmpresa,
		Puesto:      input.Puesto,
		Descripcion: input.Descripcion,
		Requisitos:  input.Requisitos,
		Salario:     input.Salario,
		Jornada:     input.Jornada,
		HoraInicio:  input.HoraInicio,
		HoraFin:     input.HoraFin,
	}

	// Insert into oferta table
	var inserted AfterInsert
	err = configs.DB.Raw("INSERT INTO oferta (id_empresa, puesto, descripcion, requisitos, salario, jornada, hora_inicio, hora_fin) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id_oferta, id_empresa, puesto, descripcion, requisitos, salario, jornada, hora_inicio, hora_fin", offer.IDEmpresa, offer.Puesto, offer.Descripcion, offer.Requisitos, offer.Salario, offer.Jornada, offer.HoraInicio, offer.HoraFin).Scan(&inserted).Error

	if err != nil { // If the insertion fails, return an error
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error creating offer: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Insert into oferta_carrera table
	for _, idCarrera := range input.IdCarreras {
		var inserted2 AfterInsert2
		err = configs.DB.Raw("INSERT INTO oferta_carrera (id_oferta, id_carrera) VALUES (?, ?) RETURNING id_oferta, id_carrera", inserted.IdOferta, idCarrera).Scan(&inserted2).Error
		if err != nil {
			c.JSON(http.StatusBadRequest, responses.StandardResponse{
				Status:  http.StatusBadRequest,
				Message: "Error creating oferta_carrera: " + err.Error(),
				Data:    nil,
			})
			return
		}
	}

	// Return a success response
	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Offer created successfully",
		Data:    nil,
	})

}

// Stores the offer as arrived from frontend
type OfferUpdateInput struct {
	Id_Oferta   int       `json:"id_oferta"`
	IDEmpresa   string    `json:"id_empresa"`
	Puesto      string    `json:"puesto"`
	Descripcion string    `json:"descripcion"`
	Requisitos  string    `json:"requisitos"`
	Salario     float64   `json:"salario"`
	IdCarreras  []string  `json:"id_carreras"`
	Jornada     string    `json:"jornada"`
	HoraInicio  time.Time `json:"hora_inicio"` // this parameters are new.
	HoraFin     time.Time `json:"hora_fin"`
}

// Updates an offer in the database
func UpdateOffer(c *gin.Context) {
	var input OfferUpdateInput     // Stores the offer as arrived from frontend
	var updatedOffer models.Oferta // Stores the object to be updated

	if err := c.BindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid input: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// extract the username from the token
	user, err := utils.TokenExtractUsername(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error extracting information from token: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Verificación con el token para que no se pueda editar ofertas de otras empresas
	originalOffer := models.Oferta{}
	err = configs.DB.Where("id_oferta = ? AND id_empresa = ?", input.Id_Oferta, input.IDEmpresa).First(&originalOffer).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting original offer: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Verificación con el token para que no se pueda editar ofertas de otras empresas
	if originalOffer.IDEmpresa != user {
		c.JSON(http.StatusForbidden, responses.StandardResponse{
			Status:  http.StatusForbidden,
			Message: "The user in the token does not match the owner of the offer",
			Data:    nil,
		})
		return
	}

	// Verificación con el token para que no se pueda editar ofertas de otras empresas
	if user != input.IDEmpresa {
		c.JSON(http.StatusForbidden, responses.StandardResponse{
			Status:  http.StatusForbidden,
			Message: "The user in the token does not match the one in the request body",
			Data:    nil,
		})
		return
	}

	// Create the offer object
	updatedOffer = models.Oferta{
		Puesto:      input.Puesto,
		Descripcion: input.Descripcion,
		Requisitos:  input.Requisitos,
		Salario:     input.Salario,
		Jornada:     input.Jornada,
		HoraInicio:  input.HoraInicio,
		HoraFin:     input.HoraFin,
	}

	// Update oferta table
	err = configs.DB.Model(&updatedOffer).Where("id_oferta = ? AND id_empresa = ?", input.Id_Oferta, input.IDEmpresa).Updates(updatedOffer).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error updating offer: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// eliminar todas las carreras de la oferta en oferta_carrera
	err = configs.DB.Where("id_oferta = ?", input.Id_Oferta).Delete(&models.OfertaCarrera{}).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error deleting oferta_carrera to update them: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Insert into oferta_carrera table
	for _, idCarreraStr := range input.IdCarreras {
		// Convierte la cadena 'idCarreraStr' a un entero 'idCarrera'
		idCarrera, err := strconv.Atoi(idCarreraStr)
		if err != nil {
			// Manejar el error si la conversión falla
			c.JSON(http.StatusBadRequest, responses.StandardResponse{
				Status:  http.StatusBadRequest,
				Message: "Error converting 'idCarrera' to int: " + err.Error(),
				Data:    nil,
			})
			return
		}

		ofertaCarrera := models.OfertaCarrera{
			IdOferta:  input.Id_Oferta,
			IdCarrera: idCarrera,
		}

		// Insertar en la tabla oferta_carrera usando Gorm
		if err := configs.DB.Create(&ofertaCarrera).Error; err != nil {
			c.JSON(http.StatusBadRequest, responses.StandardResponse{
				Status:  http.StatusBadRequest,
				Message: "Error creating oferta_carrera: " + err.Error(),
				Data:    nil,
			})
			return
		}
	}

	// Return a success response
	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Offer updated successfully",
		Data:    nil,
	})
}

// stores only the ID of the offer. Was developed in early stages of the project and should be deprecated, but we wont.
type OfferGet struct {
	Id_Oferta string `json:"id_oferta"`
}

// Returns the offer with the given ID
func GetOffer(c *gin.Context) {
	var offer models.OfertaGet
	var Company models.Empresa
	var data map[string]interface{}
	var input OfferGet

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid input: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// gets the offer id from the input
	err := configs.DB.Where("id_oferta = ?", input.Id_Oferta).First(&offer).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting offer: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// gets the company id from the offer
	err = configs.DB.Where("id_empresa = ?", offer.IDEmpresa).First(&Company).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting company: " + err.Error(),
			Data:    nil,
		})
		return
	}

	data = map[string]interface{}{
		"offer":   offer,
		"company": Company,
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Offer retrieved successfully",
		Data:    data,
	})
}

// stores the ID of the offer and the ID of the company.
type GetOfferByCompanyInput struct {
	Id_Empresa string `json:"id_empresa"`
}

type GetOfferByCompanyResponse struct {
	Id_Oferta   int       `json:"id_oferta"`
	IDEmpresa   string    `json:"id_empresa"`
	Puesto      string    `json:"puesto"`
	Descripcion string    `json:"descripcion"`
	Requisitos  string    `json:"requisitos"`
	Salario     float64   `json:"salario"`
	IdCarreras  []int     `json:"id_carreras"`
	Jornada     string    `json:"jornada"`
	HoraInicio  time.Time `json:"hora_inicio"`
	HoraFin     time.Time `json:"hora_fin"`
}

// Returns all the offers from the company with the given ID
func GetOfferByCompany(c *gin.Context) {
	var offersResponse []GetOfferByCompanyResponse
	var data map[string]interface{}
	var input GetOfferByCompanyInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid input: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// gets a lot of information from the database
	query := `
	SELECT
		o.id_oferta,
		o.id_empresa,
		o.puesto,
		o.descripcion,
		o.requisitos,
		o.salario,
		oc.id_carrera,
		o.jornada,
		o.hora_inicio,
		o.hora_fin
	FROM
		oferta o
	LEFT JOIN
		oferta_carrera oc ON o.id_oferta = oc.id_oferta
	WHERE
		o.id_empresa = ?;

	`

	rows, err := configs.DB.Raw(query, input.Id_Empresa).Rows() // Execute the query
	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting offers: " + err.Error(),
			Data:    nil,
		})
		return
	}
	defer func(rows *sql.Rows) { // Close the rows when the function returns
		err := rows.Close()
		if err != nil {
			c.JSON(http.StatusBadRequest, responses.StandardResponse{
				Status:  http.StatusBadRequest,
				Message: "Error closing rows: " + err.Error(),
				Data:    nil,
			})
			return
		}
	}(rows)

	// Create a map to store offer details and associated career IDs
	offerMap := make(map[int]GetOfferByCompanyResponse)

	// ...

	// Iterate over the rows
	for rows.Next() {
		var offer GetOfferByCompanyResponse
		var idOferta int
		var idCarrera sql.NullInt64

		if err := rows.Scan(
			&idOferta,
			&offer.IDEmpresa,
			&offer.Puesto,
			&offer.Descripcion,
			&offer.Requisitos,
			&offer.Salario,
			&idCarrera,
			&offer.Jornada,
			&offer.HoraInicio,
			&offer.HoraFin,
		); err != nil {
			c.JSON(400, responses.StandardResponse{
				Status:  400,
				Message: "Error scanning rows: " + err.Error(),
				Data:    nil,
			})
			return
		}

		// Check if the offer already exists in the map
		existingOffer, exists := offerMap[idOferta]
		if exists {
			if idCarrera.Valid {
				existingOffer.IdCarreras = append(existingOffer.IdCarreras, int(idCarrera.Int64))
			}
			offerMap[idOferta] = existingOffer
		} else {
			offer.Id_Oferta = idOferta
			offer.IdCarreras = nil
			if idCarrera.Valid {
				offer.IdCarreras = []int{int(idCarrera.Int64)}
			}
			offerMap[idOferta] = offer
		}
	}

	// ...

	// Convert the map values to a slice
	for _, offer := range offerMap {
		offersResponse = append(offersResponse, offer)
	}

	data = map[string]interface{}{
		"offers": offersResponse,
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Offers retrieved successfully",
		Data:    data,
	})
}

// stores the ID of the offer and the ID of the company.
type DeleteOfferInput struct {
	Id_Oferta string `json:"id_oferta"`
}

// Deletes the offer with the given ID
func DeleteOffer(c *gin.Context) {
	// Obtén el valor del parámetro "id_oferta" desde los query parameters
	idOferta := c.Query("id_oferta")

	// Verifica si el valor del parámetro está presente
	if idOferta == "" {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Missing id_oferta query parameter",
			Data:    nil,
		})
		return
	}

	user, err := utils.TokenExtractUsername(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error extracting information from token: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Verifica si el usuario es el dueño de la oferta
	var offer models.Oferta
	err = configs.DB.Where("id_oferta = ?", idOferta).First(&offer).Error

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting offer: " + err.Error(),
			Data:    nil,
		})
		return
	}

	if offer.IDEmpresa != user {
		c.JSON(http.StatusForbidden, responses.StandardResponse{
			Status:  http.StatusForbidden,
			Message: "The user in the token does not match the owner of the offer",
			Data:    nil,
		})
		return
	}

	err = configs.DB.Where("id_oferta = ? AND id_empresa = ?", idOferta, user).Delete(&models.Oferta{}).Error
	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error deleting oferta: " + err.Error(),
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, responses.StandardResponse{
		Status:  http.StatusOK,
		Message: "Offer deleted successfully",
		Data:    nil,
	})
}

// get aplicants from an offer
func GetApplicants(c *gin.Context) {
	var input GetPostulationInput // Stores the offer as arrived from frontend
	var tokenUsername string      // Stores the username extracted from the token

	if err := c.ShouldBindJSON(&input); err != nil { // If the input is not valid, return an error
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid input. " + err.Error(),
			Data:    nil,
		})
		return
	}

	// extract the username from the token
	tokenUsername, err := utils.TokenExtractUsername(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error extracting information from token. " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Verificación con el token para que no se pueda ver las postulaciones de otras empresas
	var offer models.Oferta
	err = configs.DB.Where("id_oferta = ?", input.IdOferta).First(&offer).Error

	if err != nil {
		// If the offer does not exist, return an error
		c.JSON(http.StatusNotFound, responses.StandardResponse{
			Status:  http.StatusNotFound,
			Message: "Error getting offer. " + err.Error(),
			Data:    nil,
		})
		return
	}

	if offer.IDEmpresa != tokenUsername {
		c.JSON(http.StatusForbidden, responses.StandardResponse{
			Status:  http.StatusForbidden,
			Message: "The user in the token does not match the owner of the offer",
			Data:    nil,
		})
		return
	}

	// Get the postulations and maps them to a slice of maps
	var results []map[string]interface{}

	rows, err := configs.DB.Raw("SELECT p.id_estudiante, p.estado, e.nombre, e.apellido, e.nacimiento, e.foto, e.carrera, e.universidad FROM postulacion p JOIN estudiante e ON p.id_estudiante = e.id_estudiante WHERE id_oferta = ?", input.IdOferta).Rows()

	if err != nil {
		c.JSON(http.StatusBadRequest, responses.StandardResponse{
			Status:  http.StatusBadRequest,
			Message: "Error getting postulations. " + err.Error(),
			Data:    nil,
		})
		return
	}
	// Close the rows when the function returns
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {
			c.JSON(http.StatusBadRequest, responses.StandardResponse{
				Status:  http.StatusBadRequest,
				Message: "Error closing postulation rows. " + err.Error(),
				Data:    nil,
			})
			return
		}
	}(rows)

	// Iterate over the rows
	for rows.Next() {
		var idEstudiante string
		var estado string
		var nombre string
		var apellido string
		var nacimiento string
		var foto sql.NullString
		var carrera string
		var universidad string

		err := rows.Scan(&idEstudiante, &estado, &nombre, &apellido, &nacimiento, &foto, &carrera, &universidad)

		if err != nil {
			c.JSON(http.StatusBadRequest, responses.StandardResponse{
				Status:  http.StatusBadRequest,
				Message: "Error scanning postulation row. " + err.Error(),
				Data:    nil,
			})
			return
		}

		result := map[string]interface{}{ // Create a map to store the postulation details
			"id_estudiante": idEstudiante,
			"estado":        estado,
			"nombre":        nombre,
			"apellido":      apellido,
			"nacimiento":    nacimiento,
			"foto":          foto.String,
			"universidad":   universidad,
		}
		results = append(results, result)
	}

	c.JSON(http.StatusOK, responses.PostulationResponse{
		Status:  http.StatusOK,
		Message: "Applicants returned successfully",
		Data:    results,
	})
}
