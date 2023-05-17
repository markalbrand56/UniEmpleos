package controllers

import (
	"backend/responses"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

func UploadFile() gin.HandlerFunc {
	return func(c *gin.Context) {
		// single file
		file, _ := c.FormFile("file")
		log.Println(file.Filename)

		dst := "./uploads" + file.Filename
		// Upload the file to specific dst.
		err := c.SaveUploadedFile(file, dst)
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
