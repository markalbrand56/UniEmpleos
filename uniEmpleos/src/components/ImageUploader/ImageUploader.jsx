import React, { useEffect, useState } from "react"
import Dropzone from "react-dropzone"
import styles from "./ImageUploader.module.css"

const ImageUploader = ({ onImageUpload, image, height, width, placeholderImage }) => {
  // Paso 3: Añadir prop onImageUpload
  const [uploadedImage, setUploadedImage] = useState("")

  const placeholder = placeholderImage || "/images/clip.svg"

  useEffect(() => {
    setUploadedImage(image)
  }, [image])

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()

    reader.onloadend = () => {
      // `reader.result` contiene los datos de la imagen en Base64
      setUploadedImage(reader.result)
      onImageUpload(reader.result) // Paso 4: Llamar a onImageUpload con el valor de la imagen
    }
    reader.readAsDataURL(file)
  }

  const imageStyle = {};
  if (height) {
    imageStyle.height = height;
  }
  if (width) {
    imageStyle.width = width;
  }

  return (
    <div className={styles.container}>
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className={styles.imageContainer}>
            <input {...getInputProps()} />
            {uploadedImage ? (
              <img
                src={uploadedImage}
                alt="Uploaded"
                className={styles.imagePreview}
              />
            ) : (
              <img
                src={placeholder}
                alt="Placeholder"
                className={styles.placeholderImage}
                style={imageStyle}
              />
            )}
          </div>
        )}
      </Dropzone>
    </div>
  )
}

export default ImageUploader
