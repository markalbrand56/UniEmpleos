package configs

import (
	"errors"
	"fmt"
	"github.com/joho/godotenv"
	"log"
	"os"
)

// EnvPG carga las variables de entorno, primero desde el sistema operativo, y si no están, desde un archivo .env
func EnvPG() map[string]string {
	envs := make(map[string]string)

	envs, err := loadSystemEnv()

	if err == nil {
		return envs
	}

	fmt.Println("Loading from .env file")
	err = godotenv.Load()

	if err != nil {
		log.Fatal("Error while loading '.env' file")
	}

	envs["PG_USER"] = os.Getenv("PG_USER")
	envs["PG_PASSWORD"] = os.Getenv("PG_PASSWORD")
	envs["PG_RDS_HOST"] = os.Getenv("PG_RDS_HOST")
	envs["PG_RDS_PORT"] = os.Getenv("PG_RDS_PORT")
	envs["PG_DATABASE"] = os.Getenv("PG_DATABASE")
	envs["DATABASE_ENDPOINT"] = os.Getenv("DATABASE_ENDPOINT")

	return envs
}

// loadSystemEnv carga las variables de entorno desde el sistema operativo, en vez de un archivo .env
func loadSystemEnv() (map[string]string, error) {
	envs := make(map[string]string)

	fmt.Println("Loading from system env")
	envs["PG_USER"] = os.Getenv("PG_USER")
	envs["PG_PASSWORD"] = os.Getenv("PG_PASSWORD")
	envs["PG_RDS_HOST"] = os.Getenv("PG_RDS_HOST")
	envs["PG_RDS_PORT"] = os.Getenv("PG_RDS_PORT")

	if envs["PG_USER"] == "" {
		return envs, errors.New("PG_USER is not set")
	}
	if envs["PG_PASSWORD"] == "" {
		return envs, errors.New("PG_PASSWORD is not set")
	}
	if envs["PG_RDS_HOST"] == "" {
		return envs, errors.New("PG_RDS_HOST is not set")
	}
	if envs["PG_RDS_PORT"] == "" {
		return envs, errors.New("PG_RDS_PORT is not set")
	}

	return envs, nil
}
