package middlewares

import (
	"backend/responses"
	"backend/utils"
	"github.com/gin-gonic/gin"
	"net/http"
)

func JwtAuthentication() gin.HandlerFunc {
	return func(c *gin.Context) {
		err := utils.TokenValid(c)
		if err != nil {
			c.JSON(http.StatusUnauthorized, responses.StandardResponse{
				Status:  401,
				Message: "Unauthorized, token is invalid: " + err.Error(),
				Data:    nil,
			})

			c.Abort()
			return
		}
		c.Next()
	}
}
