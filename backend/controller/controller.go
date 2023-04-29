package controller

import (
	"fmt"
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

		c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
	}
}
