package configs

import (
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var DB *gorm.DB

func SetupDB() {
	envs := EnvPG()

	db, err := gorm.Open("postgres", "host="+envs["PG_RDS_HOST"]+" port="+envs["PG_RDS_PORT"]+" user="+envs["PG_USER"]+" dbname=postgres password="+envs["PG_PASSWORD"]+" sslmode=disable")
	if err != nil {
		panic("failed to connect database")
	}

	fmt.Println("Connected to DB")
	DB = db
}
