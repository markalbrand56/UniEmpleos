import React, { useState } from "react"
import style from "./SignUpEmpresa.module.css"
import ComponentInput from "../../components/Input/Input"
import TextArea from "../../components/textAreaAutosize/TextAreaAuto"
import Button from "../../components/Button/Button"
import { navigate } from "../../store"
import API_URL from "../../api"
import ImageUploader from "../../components/ImageUploader/ImageUploader"
import Popup from "../../components/Popup/Popup"
import useIsImage from "../../Hooks/useIsImage"
import useApi from "../../Hooks/useApi"

const SignUpEmpresa = () => {
  const isImage = useIsImage()
  const api = useApi()

  const [nombre, setNombre] = useState("")
  const [correo, setCorreo] = useState("")
  const [detalles, setDetalles] = useState("")
  const [telefono, setTelefono] = useState("")
  const [password, setPassword] = useState("")
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
        if (telefono.length < 8) {
          setTelefono(e.target.value)
        }
        break
      case "correo":
        setCorreo(e.target.value)
        break
      case "password":
        setPassword(e.target.value)
        break
      default:
        break
    }
  }

  const handleButton = () => {
    navigate("/login")
  }

  const signup = async () => {
    if (
      nombre === "" ||
      correo === "" ||
      detalles === "" ||
      telefono === "" ||
      password === ""
    ) {
      setError("Todos los campos son obligatorios")
      setWarning(true)
    } else if (telefono.length < 8) {
      setError("El numero de telefono debe tener 8 digitos")
      setWarning(true)
    } else {
      const apiResponse = await api.handleRequest("POST", "/companies", {
        nombre,
        detalles,
        correo,
        telefono,
        contra: password,
        foto: uploadedImage,
      })
      if (apiResponse.status === 200) {
        navigate("/login")
      } else {
        setError("Upss algo salio mal")
        setWarning(true)
      }
    }
  }

  const handleUploadFile = (uploadedImage) => {
    const fileType = isImage(uploadedImage)
    if (fileType) {
      setUploadedImage(uploadedImage)
    } else {
      setError("El archivo debe ser una imagen")
      setWarning(true)
    }
  }

  const handelPopupStatus = () => {
    setWarning(false)
  }

  return (
    <div className={style.signUpCointainer}>
      <Popup message={error} status={warning} closePopup={handelPopupStatus} />
      <h1>UniEmpleos</h1>
      <div className={style.inputsContainer}>
        <div className={style.grupoDatos1}>
          <div className={style.inputSubContainer}>
            <span>Nombre</span>
            <ComponentInput
              name="nombre"
              type="text"
              placeholder="miEmpresa.org"
              value={nombre}
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputSubContainer}>
            <span>Telefono</span>
            <ComponentInput
              name="telefono"
              type="number"
              placeholder="21212413"
              value={telefono}
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputSubContainer}>
            <span>Correo</span>
            <ComponentInput
              name="correo"
              type="text"
              placeholder="empresa@org.com"
              value={correo}
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputSubContainer}>
            <span>Contraseña</span>
            <ComponentInput
              name="password"
              type="password"
              placeholder="miContraseña"
              value={password}
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputSubContainer}>
            <span>Foto de perfil</span>
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
          <div className={style.inputTextArea}>
            <span>Detalles</span>
            <TextArea
              name="detalles"
              type="text"
              placeholder="Detalles de la empresa"
              onChange={handleInputsValue}
              value={detalles}
              min={1}
              max={5}
            />
          </div>
        </div>
        <div className={style.buttonContainer}>
          <Button label="Registrarse" onClick={signup} />
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#B0E212"
          fillOpacity="1"
          d="M0,96L60,133.3C120,171,240,245,360,272C480,299,600,277,720,240C840,203,960,149,1080,
          122.7C1200,96,1320,96,1380,96L1440,96L1440,320L1380,320C1320,320,1200,320,1080,
          320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
      </svg>
    </div>
  )
}

export default SignUpEmpresa
