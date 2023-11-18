package controllers

import (
	"backend/configs"
	"backend/models"
	"backend/responses"
	"backend/utils"
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

// Updates the profile picture of the user
func UpdateProfilePicture() gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := utils.TokenExtractUsername(c) // get the username from the token
		acceptedFileTypes := []string{"png", "jpg", "jpeg"}

		if err != nil { // if the token is invalid
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
		fileHeader, _ := c.FormFile("file") // get the file from the request

		// get the file type from filename
		fileType := fileHeader.Filename[strings.LastIndex(fileHeader.Filename, ".")+1:]

		if !utils.Contains(acceptedFileTypes, fileType) { // if the file type is not accepted
			c.JSON(http.StatusBadRequest, responses.StandardResponse{
				Status:  http.StatusBadRequest,
				Message: "Invalid file type. Accepted file types are " + strings.Join(acceptedFileTypes, ", "),
				Data:    nil,
			})
			return
		}

		// generate a random image.
		randomNumber := rand.Intn(9999999999-1111111111) + 1111111111
		newFileName := user_stripped + "_" + fmt.Sprint(randomNumber) + "." + fileType

		fileHeader.Filename = newFileName
		dst := "./uploads/" + newFileName // destination

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
		userType, err := utils.TokenExtractRole(c)

		if err != nil {
			c.JSON(http.StatusUnauthorized, responses.StandardResponse{
				Status:  http.StatusUnauthorized,
				Message: "Unauthorized. Cannot get information from token. " + err.Error(),
				Data:    nil,
			})
			return
		}

		// Update the profile picture in the database
		if userType == "student" {
			err = configs.DB.Model(&models.Estudiante{}).Where("correo = ?", user).Updates(models.Estudiante{Foto: newFileName}).Error
		} else if userType == "enterprise" {
			err = configs.DB.Model(&models.Empresa{}).Where("correo = ?", user).Updates(models.Empresa{Foto: newFileName}).Error
		}

		// Save locally
		err = c.SaveUploadedFile(fileHeader, dst)
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
		bearerToken := "Bearer " + utils.ExtractTokenFromRequest(c)

		if err := utils.UploadFileToServer(url, bearerToken, fileHeader, dst); err != nil {
			c.JSON(http.StatusInternalServerError, responses.StandardResponse{
				Status:  http.StatusInternalServerError,
				Message: "Failed to upload file to server: " + err.Error(),
				Data:    nil,
			})
			return
		}

		// Eliminar el archivo local. Ya no es necesario, ya que se subió al servidor de archivos
		//fmt.Println("Deleting file: " + dst)
		if err := os.Remove(dst); err != nil {
			c.JSON(http.StatusInternalServerError, responses.StandardResponse{
				Status:  http.StatusInternalServerError,
				Message: "Failed to delete local file: " + err.Error(),
				Data:    nil,
			})
			return
		}

		// return the filename to the client
		c.JSON(http.StatusOK, responses.StandardResponse{
			Status:  http.StatusOK,
			Message: "File uploaded successfully",
			Data: map[string]interface{}{
				"filename": newFileName,
			},
		})
	}
}

// Updates the CV of the user
func UpdateCV() gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := utils.TokenExtractUsername(c)
		acceptedFileTypes := []string{"pdf"}

		if err != nil { // if the token is invalid
			c.JSON(http.StatusUnauthorized, responses.StandardResponse{
				Status:  http.StatusUnauthorized,
				Message: "Unauthorized. Cannot get information from token. " + err.Error(),
				Data:    nil,
			})
			return
		}

		// strip username from email. ignoring everything after @
		user_stripped := user[:strings.Index(user, "@")]
		fmt.Println("Username upload: " + user_stripped) // single file (print-debbuging)

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

		// generate a random image.
		randomNumber := rand.Intn(9999999999-1111111111) + 1111111111
		newFileName := user_stripped + "_" + fmt.Sprint(randomNumber) + "." + fileType

		file.Filename = newFileName

		dst := "./uploads/pdf/" + newFileName
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
		userType, err := utils.TokenExtractRole(c)

		if err != nil {
			c.JSON(http.StatusUnauthorized, responses.StandardResponse{
				Status:  http.StatusUnauthorized,
				Message: "Unauthorized. Cannot get information from token. " + err.Error(),
				Data:    nil,
			})
			return
		}

		// Update the profile picture in the database
		if userType != "student" {
			c.JSON(http.StatusUnauthorized, responses.StandardResponse{
				Status:  http.StatusUnauthorized,
				Message: "Unauthorized. Only students can upload CVs.",
				Data:    nil,
			})
			return
		}

		// Update the profile picture in the database
		err = configs.DB.Model(&models.Estudiante{}).Where("correo = ?", user).Updates(models.Estudiante{CV: newFileName}).Error

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
		url := "http://ec2-13-57-42-212.us-west-1.compute.amazonaws.com/upload/pdf/"
		bearerToken := "Bearer " + utils.ExtractTokenFromRequest(c)

		if err := utils.UploadFileToServer(url, bearerToken, file, dst); err != nil {
			c.JSON(http.StatusInternalServerError, responses.StandardResponse{
				Status:  http.StatusInternalServerError,
				Message: "Failed to upload file to server: " + err.Error(),
				Data:    nil,
			})
			return
		}

		// Eliminar el archivo local. Ya no es necesario, ya que se subió al servidor de archivos
		if err := os.Remove(dst); err != nil {
			c.JSON(http.StatusInternalServerError, responses.StandardResponse{
				Status:  http.StatusInternalServerError,
				Message: "Failed to delete local file: " + err.Error(),
				Data:    nil,
			})
			return
		}

		// return the filename to the client
		c.JSON(http.StatusOK, responses.StandardResponse{
			Status:  http.StatusOK,
			Message: "File uploaded successfully",
			Data: map[string]interface{}{
				"filename": newFileName,
			},
		})
	}
}

// Deletes the profile picture of the user
func deleteFilesWithPrefix(directory, prefix string) error {
	files, err := os.ReadDir(directory) // read the directory
	if err != nil {
		return err
	} // iterate over the files

	for _, file := range files {
		if strings.HasPrefix(file.Name(), prefix) { // if the file starts with the prefix
			filePath := filepath.Join(directory, file.Name())
			fmt.Println("Deleting file: " + filePath) // delete the file
			if err := os.Remove(filePath); err != nil {
				return err
			}
		}
	}
	return nil
}

// Returns the profile picture of the user
func GetProfilePicture() gin.HandlerFunc {
	return func(c *gin.Context) {
		filename := c.Param("filename")
		fileURL := configs.FileServer + filename

		// Realizar una solicitud GET al servidor de archivos externo
		resp, err := http.Get(fileURL)
		if err != nil {
			c.JSON(http.StatusNotFound, responses.StandardResponse{
				Status:  http.StatusNotFound,
				Message: "Error al obtener el archivo: " + err.Error(),
				Data:    nil,
			})
			return
		}

		defer func(Body io.ReadCloser) { // Cerrar el cuerpo de la respuesta del servidor de archivos externo
			err := Body.Close()
			if err != nil { // Si hay un error al cerrar el cuerpo de la respuesta del servidor de archivos externo
				c.JSON(http.StatusInternalServerError, responses.StandardResponse{
					Status:  http.StatusInternalServerError,
					Message: "Error al cerrar el cuerpo de la respuesta del servidor de archivos externo: " + err.Error(),
					Data:    nil,
				})
				return
			}
		}(resp.Body)

		if resp.StatusCode != http.StatusOK { // Si el código de estado de la respuesta del servidor de archivos externo no es 200
			c.JSON(http.StatusNotFound, responses.StandardResponse{
				Status:  http.StatusNotFound,
				Message: "Archivo no encontrado en el servidor de archivos externo",
				Data:    nil,
			})
			return
		}

		// Configurar las cabeceras de la respuesta para el cliente
		c.Header("Content-Type", resp.Header.Get("Content-Type"))
		c.Header("Content-Disposition", "inline; filename="+filename)
		c.Header("Content-Length", resp.Header.Get("Content-Length"))

		// Copiar el cuerpo de la respuesta del servidor de archivos al cuerpo de la respuesta de Gin
		_, err = io.Copy(c.Writer, resp.Body)
		if err != nil {
			c.JSON(http.StatusInternalServerError, responses.StandardResponse{
				Status:  http.StatusInternalServerError,
				Message: "Error al copiar el cuerpo de la respuesta del servidor de archivos externo: " + err.Error(),
				Data:    nil,
			})
			return
		}
	}
}

// Returns the CV of the user
func GetCV() gin.HandlerFunc {
	return func(c *gin.Context) {
		filename := c.Param("filename")                   // Obtener el nombre del archivo de la URL
		fileURL := configs.FileServer + "pdf/" + filename // Construir la URL del servidor de archivos externo

		// Realizar una solicitud GET al servidor de archivos externo
		resp, err := http.Get(fileURL)
		if err != nil { // Si hay un error al realizar la solicitud GET, devolver un error al cliente
			c.JSON(http.StatusNotFound, responses.StandardResponse{
				Status:  http.StatusNotFound,
				Message: "Error al obtener el archivo: " + err.Error(),
				Data:    nil,
			})
			return
		}

		// Cerrar el cuerpo de la respuesta del servidor de archivos externo
		defer func(Body io.ReadCloser) {
			err := Body.Close()
			if err != nil { // Si hay un error al cerrar el cuerpo de la respuesta del servidor de archivos externo
				c.JSON(http.StatusInternalServerError, responses.StandardResponse{
					Status:  http.StatusInternalServerError,
					Message: "Error al cerrar el cuerpo de la respuesta del servidor de archivos externo: " + err.Error(),
					Data:    nil,
				})
				return
			}
		}(resp.Body) // Cerrar el cuerpo de la respuesta del servidor de archivos externo

		if resp.StatusCode != http.StatusOK { // Si el código de estado de la respuesta del servidor de archivos externo no es 200
			c.JSON(http.StatusNotFound, responses.StandardResponse{
				Status:  http.StatusNotFound,
				Message: "Archivo no encontrado en el servidor de archivos externo",
				Data:    nil,
			})
			return
		}

		// Configurar las cabeceras de la respuesta para el cliente
		c.Header("Content-Type", resp.Header.Get("Content-Type"))
		c.Header("Content-Disposition", "inline; filename="+filename)
		c.Header("Content-Length", resp.Header.Get("Content-Length"))

		// Copiar el cuerpo de la respuesta del servidor de archivos al cuerpo de la respuesta de Gin
		_, err = io.Copy(c.Writer, resp.Body)
		if err != nil {
			c.JSON(http.StatusInternalServerError, responses.StandardResponse{
				Status:  http.StatusInternalServerError,
				Message: "Error al copiar el cuerpo de la respuesta del servidor de archivos externo: " + err.Error(),
				Data:    nil,
			})
			return
		}
	}
}
