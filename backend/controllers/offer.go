package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
)

type OfferInput struct {
	IDEmpresa   string   `json:"id_empresa"`
	Puesto      string   `json:"puesto"`
	Descripcion string   `json:"descripcion"`
	Requisitos  string   `json:"requisitos"`
	Salario     float64  `json:"salario"`
	IdCarreras  []string `json:"id_carreras"`
}

type AfterInsert struct {
	IdOferta    int     `json:"id_oferta"`
	IDEmpresa   string  `json:"id_empresa"`
	Puesto      string  `json:"puesto"`
	Descripcion string  `json:"descripcion"`
	Requisitos  string  `json:"requisitos"`
	Salario     float64 `json:"salario"`
}

type AfterInsert2 struct {
	IdOferta  int `json:"id_oferta"`
	IdCarrera int `json:"id_carrera"`
}

func NewOffer(c *gin.Context) {
	var input OfferInput

	if err := c.BindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Invalid input: " + err.Error(),
			Data:    nil,
		})
		return
	}

	offer := models.Oferta{
		IDEmpresa:   input.IDEmpresa,
		Puesto:      input.Puesto,
		Descripcion: input.Descripcion,
		Requisitos:  input.Requisitos,
		Salario:     input.Salario,
	}

	fmt.Println(offer)

	var inserted AfterInsert
	err := configs.DB.Raw("INSERT INTO oferta (id_empresa, puesto, descripcion, requisitos, salario) VALUES (?, ?, ?, ?, ?) RETURNING id_oferta, id_empresa, puesto, descripcion, requisitos, salario", offer.IDEmpresa, offer.Puesto, offer.Descripcion, offer.Requisitos, offer.Salario).Scan(&inserted).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error creating offer: " + err.Error(),
			Data:    nil,
		})
		return
	}

	fmt.Println("\ncarreras: ", input.IdCarreras)

	// Insert into oferta_carrera table
	for _, idCarrera := range input.IdCarreras {
		var inserted2 AfterInsert2
		err = configs.DB.Raw("INSERT INTO oferta_carrera (id_oferta, id_carrera) VALUES (?, ?) RETURNING id_oferta, id_carrera", inserted.IdOferta, idCarrera).Scan(&inserted2).Error
		if err != nil {
			c.JSON(400, responses.StandardResponse{
				Status:  400,
				Message: "Error creating oferta_carrera: " + err.Error(),
				Data:    nil,
			})
			return
		}
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Offer and oferta_carrera created successfully",
		Data:    nil,
	})

}

type OfferUpdateInput struct {
	Id_Oferta   int      `json:"id_oferta"`
	IDEmpresa   string   `json:"id_empresa"`
	Puesto      string   `json:"puesto"`
	Descripcion string   `json:"descripcion"`
	Requisitos  string   `json:"requisitos"`
	Salario     float64  `json:"salario"`
	IdCarreras  []string `json:"id_carreras"`
}

func UpdateOffer(c *gin.Context) {
	var input OfferUpdateInput
	var offer models.Oferta

	if err := c.BindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Invalid input: " + err.Error(),
			Data:    nil,
		})
		return
	}

	offer = models.Oferta{
		IDEmpresa:   input.IDEmpresa,
		Puesto:      input.Puesto,
		Descripcion: input.Descripcion,
		Requisitos:  input.Requisitos,
		Salario:     input.Salario,
	}

	err := configs.DB.Model(&offer).Where("id_oferta = ?", input.Id_Oferta).Updates(offer).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error updating offer: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// eliminar todas las carreras de la oferta en oferta_carrera
	err = configs.DB.Where("id_oferta = ?", input.Id_Oferta).Delete(&models.OfertaCarrera{}).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error deleting oferta_carrera to update them: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Insert into oferta_carrera table
	for _, idCarrera := range input.IdCarreras {
		var inserted2 AfterInsert2
		err = configs.DB.Raw("INSERT INTO oferta_carrera (id_oferta, id_carrera) VALUES (?, ?) RETURNING id_oferta, id_carrera", input.Id_Oferta, idCarrera).Scan(&inserted2).Error
		if err != nil {
			c.JSON(400, responses.StandardResponse{
				Status:  400,
				Message: "Error creating oferta_carrera: " + err.Error(),
				Data:    nil,
			})
			return
		}
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Offer updated successfully",
		Data:    nil,
	})
}

type OfferGet struct {
	Id_Oferta string `json:"id_oferta"`
}

func GetOffer(c *gin.Context) {
	var offer models.OfertaGet
	var Company models.Empresa
	var data map[string]interface{}
	var input OfferGet

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Invalid input: " + err.Error(),
			Data:    nil,
		})
		return
	}

	err := configs.DB.Where("id_oferta = ?", input.Id_Oferta).First(&offer).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error getting offer: " + err.Error(),
			Data:    nil,
		})
		return
	}

	err = configs.DB.Where("id_empresa = ?", offer.IDEmpresa).First(&Company).Error

	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error getting company: " + err.Error(),
			Data:    nil,
		})
		return
	}

	data = map[string]interface{}{
		"offer":   offer,
		"company": Company,
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Offer retrieved successfully",
		Data:    data,
	})
}

type GetOfferByCompanyInput struct {
	Id_Empresa string `json:"id_empresa"`
}

type GetOfferByCompanyResponse struct {
	Id_Oferta   int     `json:"id_oferta"`
	IDEmpresa   string  `json:"id_empresa"`
	Puesto      string  `json:"puesto"`
	Descripcion string  `json:"descripcion"`
	Requisitos  string  `json:"requisitos"`
	Salario     float64 `json:"salario"`
	IdCarreras  []int   `json:"id_carreras"`
}

func GetOfferByCompany(c *gin.Context) {
	var offersResponse []GetOfferByCompanyResponse
	var data map[string]interface{}
	var input GetOfferByCompanyInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Invalid input: " + err.Error(),
			Data:    nil,
		})
		return
	}

	query := `
	SELECT
		o.id_oferta,
		o.id_empresa,
		o.puesto,
		o.descripcion,
		o.requisitos,
		o.salario,
		oc.id_carrera
	FROM
		oferta o
	LEFT JOIN
		oferta_carrera oc ON o.id_oferta = oc.id_oferta
	WHERE
		o.id_empresa = ?;

	`

	rows, err := configs.DB.Raw(query, input.Id_Empresa).Rows()
	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error getting offers: " + err.Error(),
			Data:    nil,
		})
		return
	}
	defer rows.Close()

	// Create a map to store offer details and associated career IDs
	offerMap := make(map[int]GetOfferByCompanyResponse)

	// ...

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

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Offers retrieved successfully",
		Data:    data,
	})
}

type DeleteOfferInput struct {
	Id_Oferta string `json:"id_oferta"`
}

func DeleteOffer(c *gin.Context) {
	var input DeleteOfferInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Invalid input: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Delete oferta_carrera
	err := configs.DB.Where("id_oferta = ?", input.Id_Oferta).Delete(&models.OfertaCarrera{}).Error
	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error deleting oferta_carrera: " + err.Error(),
			Data:    nil,
		})
		return
	}

	// Delete oferta
	err = configs.DB.Where("id_oferta = ?", input.Id_Oferta).Delete(&models.Oferta{}).Error
	if err != nil {
		c.JSON(400, responses.StandardResponse{
			Status:  400,
			Message: "Error deleting oferta: " + err.Error(),
			Data:    nil,
		})
		return
	}

	c.JSON(200, responses.StandardResponse{
		Status:  200,
		Message: "Offer deleted successfully",
		Data:    nil,
	})
}
