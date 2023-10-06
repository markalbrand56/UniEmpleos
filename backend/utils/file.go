package utils

import (
	"bytes"
	"fmt"
	"io/ioutil"
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
	// open file
	f, err := file.Open()
	if err != nil {
		return err
	}
	defer f.Close()

	// read file
	fileBytes, err := ioutil.ReadAll(f)
	if err != nil {
		return err
	}

	// create new request body
	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("file", filepath.Base(dst))
	if err != nil {
		return err
	}
	part.Write(fileBytes)
	writer.Close()

	// create new request
	req, err := http.NewRequest("POST", url, body)
	if err != nil {
		return err
	}
	req.Header.Add("Authorization", bearer)
	req.Header.Add("Content-Type", writer.FormDataContentType())

	// send request
	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	// read response
	responseBody, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return err
	}

	fmt.Println(string(responseBody))

	return nil
}
