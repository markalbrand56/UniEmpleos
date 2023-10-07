package configs

import (
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"os"
)

var DB *gorm.DB
var FileServer = "http://ec2-13-57-42-212.us-west-1.compute.amazonaws.com/files/"

func SetupDB() {
	envs := EnvPG()

	db, err := gorm.Open("postgres", "host="+envs["PG_RDS_HOST"]+" port="+envs["PG_RDS_PORT"]+" user="+envs["PG_USER"]+" dbname=postgres password="+envs["PG_PASSWORD"]+" sslmode=disable")
	if err != nil {
		panic("failed to connect database")
	}

	fmt.Println("Connected to DB")
	DB = db
}

func CreateDirIfNotExist(path string) (bool, error) {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		fmt.Println("Directory " + path + " does not exist. Creating...")
		err := os.Mkdir(path, 0777)
		if err != nil {
			return false, err
		}
		return true, nil
	}
	return false, nil
}
