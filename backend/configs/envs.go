package configs

import (
	"github.com/joho/godotenv"
	"log"
	"os"
)

func EnvPG() map[string]string {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error while loading '.env' file")
	}

	envs := make(map[string]string)

	envs["PG_USER"] = os.Getenv("PG_USER")
	envs["PG_PASSWORD"] = os.Getenv("PG_PASSWORD")
	envs["PG_RDS_HOST"] = os.Getenv("PG_RDS_HOST")
	envs["PG_RDS_PORT"] = os.Getenv("PG_RDS_PORT")

	return envs
}
