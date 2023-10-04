package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"backend/utils"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

func UpdateProfilePicture() gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := utils.ExtractTokenUsername(c)
		acceptedFileTypes := []string{"png", "jpg", "jpeg"}

		if err != nil {
			c.JSON(http.StatusUnauthorized, responses.StandardResponse{
				Status:  http.StatusUnauthorized,
				Message: "Unauthorized. Cannot get information from token. " + err.Error(),
				Data:    nil,
			})
			return
		}

		// strip username from email. ignoring everything after @
		user_stripped := user[:strings.Index(user, "@")]
		fmt.Println("Username upload: " + user_stripped)

		// single file
		file, _ := c.FormFile("file")

		// get the file type from filename
		fileType := file.Filename[strings.LastIndex(file.Filename, ".")+1:]

		if !utils.Contains(acceptedFileTypes, fileType) {
			c.JSON(http.StatusBadRequest, responses.StandardResponse{
				Status:  http.StatusBadRequest,
				Message: "Invalid file type. Accepted file types are " + strings.Join(acceptedFileTypes, ", "),
				Data:    nil,
			})
			return
		}

		newFileName := user_stripped + "." + fileType

		dst := "./uploads/" + newFileName
		fmt.Println("File: " + dst)

		// Actualizar en base de datos
		userType, err := utils.ExtractTokenUserType(c)

		if err != nil {
			c.JSON(http.StatusUnauthorized, responses.StandardResponse{
				Status:  http.StatusUnauthorized,
				Message: "Unauthorized. Cannot get information from token. " + err.Error(),
				Data:    nil,
			})
			return
		}

		if userType == "student" {
			err = configs.DB.Model(&models.Estudiante{}).Where("correo = ?", user).Updates(models.Estudiante{Foto: newFileName}).Error
		} else if userType == "company" {
			err = configs.DB.Model(&models.Empresa{}).Where("correo = ?", user).Updates(models.Empresa{Foto: newFileName}).Error
		}

		// Upload the file to specific dst.
		err = c.SaveUploadedFile(file, dst)
		if err != nil {
			return
		}

		c.JSON(http.StatusOK, responses.StandardResponse{
			Status:  http.StatusOK,
			Message: "File uploaded successfully",
			Data: map[string]interface{}{
				"filename": newFileName,
			},
		})
	}
}

func GetFile() gin.HandlerFunc {
	return func(c *gin.Context) {
		filename := c.Param("filename")
		filePath := "./uploads/" + filename
		c.File(filePath) // Esto sirve el archivo al cliente
	}
}
