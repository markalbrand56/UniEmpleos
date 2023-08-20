import React, { useEffect, useState } from "react"
import { useStoreon } from "storeon/react"
import style from "./EditProfileEmpresa.module.css"
import ComponentInput from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import TextArea from "../../components/textAreaAutosize/TextAreaAuto"
import { Header } from "../../components/Header/Header"
import { navigate } from "../../store"
import useApi from "../../Hooks/useApi"
import useIsImage from "../../Hooks/useIsImage"
import ImageUploader from "../../components/ImageUploader/ImageUploader"
import Popup from "../../components/Popup/Popup"

const EditProfileEmpresa = () => {
  const api = useApi()
  const isImage = useIsImage()
  const { user } = useStoreon("user")

  const [nombre, setNombre] = useState("")
  const [correo, setCorreo] = useState("")
  const [detalles, setDetalles] = useState("")
  const [telefono, setTelefono] = useState("")
  const [uploadedImage, setUploadedImage] = useState("")
  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")

  const handleInputsValue = (e) => {
    switch (e.target.name) {
      case "nombre":
        setNombre(e.target.value)
        break
      case "detalles":
        setDetalles(e.target.value)
        break
      case "telefono":
        if (e.target.value.length < 9) {
          setTelefono(e.target.value)
        }
        break
      case "correo":
        setCorreo(e.target.value)
        break
      default:
        break
    }
  }
  useEffect(() => {
    if (api.data) {
      setNombre(api.data.usuario.nombre)
      setCorreo(api.data.usuario.correo)
      setDetalles(api.data.usuario.detalles)
      setTelefono(parseInt(api.data.usuario.telefono, 10))
      setUploadedImage(api.data.usuario.foto)
    }
  }, [api.data])

  useEffect(() => {
    api.handleRequest("GET", "/users/")
  }, [])

  const body = {
    nombre,
    detalles,
    correo,
    telefono: telefono.toString(),
    foto: uploadedImage,
  }

  // Con esto se pueden hacer las llamadas al status
  const handleButton = async () => {
    if (nombre === "" || detalles === "" || telefono === "") {
      setError("Todos los campos son obligatorios")
      setWarning(true)
    } else if (telefono.length < 8) {
      setError("El numero de telefono no es valido")
      setWarning(true)
    }else {
      const apiResponse = await api.handleRequest(
        "PUT",
        "/companies/update",
        body
      )
      if (apiResponse.status === 200) {
        navigate("/profilecompany")
      } else {
        setError("Upss... Algo salio mal atras, intenta mas tarde")
        setWarning(true)
      }
    }
  }

  const handleUploadFile = (uploadedImage) => {
    const fileType = isImage(uploadedImage)
    if (fileType) {
      setUploadedImage(uploadedImage)
    } else {
      setUploadedImage("")
      setError("El archivo debe ser una imagen")
      setWarning(true)
    }
  }

  const handelPopupStatus = () => {
    setWarning(false)
  }

  return (
    <div className={style.defaultContainer}>
      <Popup message={error} status={warning} closePopup={handelPopupStatus} />
      <div className={style.headerContainer}>
        <Header userperson="company" />
      </div>
      <div className={style.contentContainer}>
        <div className={style.imgContainer}>
          <div className={style.imageUploaderContainer}>
            <ImageUploader
              onImageUpload={handleUploadFile}
              image={uploadedImage}
              width="30px"
              height="30px"
              placeholderImage="/images/pfp.svg"
            />
          </div>
        </div>
        <div className={style.editProfileContainer}>
          <div className={style.inputsContainer}>
            <div className={style.grupoDatos1}>
              <div className={style.inputSubContainer}>
                <span>Nombre</span>
                <ComponentInput
                  value={nombre}
                  name="nombre"
                  type="text"
                  placeholder="miEmpresa.org"
                  onChange={handleInputsValue}
                />
              </div>
              <div className={style.inputSubContainer}>
                <span>Telefono</span>
                <ComponentInput
                  value={telefono}
                  name="telefono"
                  type="number"
                  placeholder="21212413"
                  onChange={handleInputsValue}
                />
              </div>
              <div className={style.inputTextArea}>
                <span>Detalles</span>
                <TextArea
                  value={detalles}
                  name="detalles"
                  type="text"
                  placeholder="Detalles de la empresa"
                  onChange={handleInputsValue}
                  min={1}
                  max={5}
                />
              </div>
            </div>
            <div className={style.buttonContainer}>
              <Button label="Guardar" onClick={handleButton} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfileEmpresa
