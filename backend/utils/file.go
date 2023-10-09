package utils

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"path/filepath"
)

func Contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}

	return false
}

func UploadFileToServer(url string, bearer string, file *multipart.FileHeader, dst string) error {
	// Abrir el archivo
	f, err := file.Open()
	if err != nil {
		return err
	}
	defer f.Close()

	// Leer el archivo
	fileBytes, err := io.ReadAll(f)
	if err != nil {
		return err
	}

	// Crear el body de la request
	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("file", filepath.Base(dst))
	if err != nil {
		return err
	}

	_, err = part.Write(fileBytes)
	if err != nil {
		return err
	}

	err = writer.Close()
	if err != nil {
		return err
	}

	// Crear la request
	req, err := http.NewRequest("POST", url, body)
	if err != nil {
		return err
	}
	req.Header.Add("Authorization", bearer)
	req.Header.Add("Content-Type", writer.FormDataContentType())

	// Hacer la request
	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	// Leer el body de la respuesta
	responseBody, err := io.ReadAll(res.Body)
	if err != nil {
		return err
	}

	fmt.Println(string(responseBody))

	return nil
}
