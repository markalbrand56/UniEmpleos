package controllers

import (
	"backend/responses"
	"backend/utils"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strings"
)

func UpdateProfilePicture() gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := utils.ExtractTokenUsername(c)

		if err != nil {
			c.JSON(http.StatusUnauthorized, responses.StandardResponse{
				Status:  http.StatusUnauthorized,
				Message: "Unauthorized. " + err.Error(),
				Data:    nil,
			})
			return
		}

		// strip username from email. ignoring everything after @
		user = user[:strings.Index(user, "@")]
		fmt.Println("Username upload: " + user)

		// single file
		file, _ := c.FormFile("file")
		log.Println(file.Filename)

		// get the file type from filename
		fileType := file.Filename[strings.LastIndex(file.Filename, ".")+1:]
		fmt.Println("File type: " + fileType)

		dst := "./uploads/" + user + "." + fileType
		// Upload the file to specific dst.
		err = c.SaveUploadedFile(file, dst)
		if err != nil {
			return
		}

		c.JSON(http.StatusOK, responses.StandardResponse{
			Status:  http.StatusOK,
			Message: "File uploaded successfully",
			Data:    nil,
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
