package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"backend/utils"
	"fmt"
	"github.com/gin-gonic/gin"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
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

		randomNumber := rand.Intn(9999999999-1111111111) + 1111111111
		newFileName := user_stripped + "_" + fmt.Sprint(randomNumber) + "." + fileType

		file.Filename = newFileName

		dst := "./uploads/" + newFileName
		fmt.Println("File: " + dst)

		// Eliminar archivos antiguos con el mismo prefijo de usuario
		if err := deleteFilesWithPrefix("./uploads/", user_stripped); err != nil {
			c.JSON(http.StatusInternalServerError, responses.StandardResponse{
				Status:  http.StatusInternalServerError,
				Message: "Failed to delete old files: " + err.Error(),
				Data:    nil,
			})
			return
		}

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
		} else if userType == "enterprise" {
			err = configs.DB.Model(&models.Empresa{}).Where("correo = ?", user).Updates(models.Empresa{Foto: newFileName}).Error
		}

		// Save locally
		err = c.SaveUploadedFile(file, dst)
		if err != nil {
			c.JSON(http.StatusInternalServerError, responses.StandardResponse{
				Status:  http.StatusInternalServerError,
				Message: "Failed to save file: " + err.Error(),
				Data:    nil,
			})
			return
		}

		// send the file via HTTP to the file server
		url := "http://ec2-13-57-42-212.us-west-1.compute.amazonaws.com/upload/"
		bearerToken := "Bearer " + utils.ExtractToken(c)

		if err := utils.UploadFileToServer(url, bearerToken, file, dst); err != nil {
			c.JSON(http.StatusInternalServerError, responses.StandardResponse{
				Status:  http.StatusInternalServerError,
				Message: "Failed to upload file to server: " + err.Error(),
				Data:    nil,
			})
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

func deleteFilesWithPrefix(directory, prefix string) error {
	files, err := os.ReadDir(directory)
	if err != nil {
		return err
	}

	for _, file := range files {
		fmt.Println(file.Name())
		if strings.HasPrefix(file.Name(), prefix) {
			filePath := filepath.Join(directory, file.Name())
			fmt.Println("Deleting file: " + filePath)
			if err := os.Remove(filePath); err != nil {
				return err
			}
		}
	}

	return nil
}

func GetFile() gin.HandlerFunc {
	return func(c *gin.Context) {
		filename := c.Param("filename")
		filePath := "./uploads/" + filename
		c.File(filePath) // Esto sirve el archivo al cliente
	}
}
