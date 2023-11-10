import React, { useState } from "react"
import style from "./SignUpEmpresa.module.css"
import ComponentInput from "../../components/Input/Input"
import TextArea from "../../components/textAreaAutosize/TextAreaAuto"
import Button from "../../components/Button/Button"
import { navigate } from "../../store"
import Popup from "../../components/Popup/Popup"
import useApi from "../../Hooks/useApi"
import { useStoreon } from "storeon/react"
import InputFile from "../../components/InputFile/InputFile"
import { AiOutlineCloudDownload } from "react-icons/ai"
import { TbEdit } from "react-icons/tb"
import Loader from "../../components/Loader/Loader"

const SignUpEmpresa = () => {
  const { dispatch } = useStoreon("user")
  const { user } = useStoreon("user")
  const api = useApi()
  const apiPfp = useApi()

  const [nombre, setNombre] = useState("")
  const [correo, setCorreo] = useState("")
  const [detalles, setDetalles] = useState("")
  const [telefono, setTelefono] = useState("")
  const [password, setPassword] = useState("")
  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [typeError, setTypeError] = useState(1)
  const [pfp, setPfp] = useState("")
  const [pfpText, setPfpText] = useState("")
  const [pfpPreview, setPfpPreview] = useState("/images/pfp.svg")
  const [isLoading, setIsLoading] = useState(false)

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

  const signup = async () => {
    if (
      nombre === "" ||
      correo === "" ||
      detalles === "" ||
      telefono === "" ||
      password === ""
    ) {
      setTypeError(1)
      setError("Todos los campos son obligatorios")
      setWarning(true)
    } else if (telefono.length < 8) {
      setTypeError(1)
      setError("El numero de telefono debe tener 8 digitos")
      setWarning(true)
    } else {
      setIsLoading(true)
      const apiResponse = await api.handleRequest("POST", "/companies", {
        nombre,
        detalles,
        correo,
        telefono,
        contra: password,
        foto: "",
      })
      if (apiResponse.status === 200) {
        const { token } = apiResponse.data
        dispatch("user/config", {
          token,
        })

        const usuario = await user.token
        console.log(usuario)
        
        if (pfp) {
          const data = await apiPfp.updateProfilePicture(pfp)
          if (data.status === 200) {
            console.log("Foto actualizada")
          } else {
            setTypePopUp(2)
            setError(
              "Upss... No se pudo actualizar tu foto de perfil, intenta mas tarde"
            )
            setWarning(true)
          }
        }
        setTypeError(3)
        setError("Registro exitoso")
        setWarning(true)
        setTimeout(() => {
          setIsLoading(false)
          navigate("/login")
        }, 5000)
      } else if (apiResponse.status === 409) {
        setTypeError(2)
        setError("El correo ya esta registrado")
        setWarning(true)
      } else {
        setTypeError(1)
        setError("Upss algo salio mal")
        setWarning(true)
      }
    }
  }

  const handleImageSelect = (event) => {
    const selectedFile = event.target.files[0]
    if (
      selectedFile &&
      (selectedFile.type === "image/png" ||
        selectedFile.type === "image/jpeg" ||
        selectedFile.type === "image/jpg")
    ) {
      setPfpText(selectedFile.name)
      setPfp(selectedFile)
      setPfpPreview(URL.createObjectURL(selectedFile))
    } else {
      setTypePopUp(2)
      setError("Debes seleccionar un archivo PNG, JPG o JPEG")
      setWarning(true)
    }
  }

  const handlePassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={style.signUpCointainer}>
      <Popup
        message={error}
        status={warning}
        style={typeError}
        close={() => setWarning(false)}
      />
      {isLoading ? (
        <div className={style.loaderContainer}>
          <Loader size={100} />
        </div>
      ) : (
        <div className={style.mainContainer}>
          <div className={style.imgContainer}>
            <img src={pfpPreview} alt="profile picture" />
            <div className={style.editImageContainer}>
              <label>
                <TbEdit size={25} color="#fff" className={style.imageSvg} />
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  className={style.inputImage}
                  style={{ display: "none" }}
                  onChange={handleImageSelect}
                />
              </label>
            </div>
          </div>
          <div className={style.dataContainer}>
            <div className={style.dataGroup2Container}>
              <div className={style.nameContainer}>
                <span>Nombre</span>
                <ComponentInput
                  name="nombre"
                  type="text"
                  placeholder="Juan"
                  value={nombre}
                  onChange={handleInputsValue}
                />
              </div>
              <div className={style.phoneContainer}>
                <span>Telefono</span>
                <ComponentInput
                  value={telefono}
                  name="telefono"
                  type="number"
                  placeholder="34325456"
                  onChange={handleInputsValue}
                />
              </div>
              <div className={style.emailContainer}>
                <span>Correo</span>
                <ComponentInput
                  name="correo"
                  type="text"
                  value={correo}
                  placeholder="uni@uni.com"
                  onChange={handleInputsValue}
                />
              </div>
              <div className={style.passwordContainer}>
                <span>Contraseña</span>
                <ComponentInput
                  name="password"
                  type="password"
                  placeholder="micontraseña123"
                  onChange={handleInputsValue}
                  eye
                  onClickButton={handlePassword}
                  isOpen={showPassword}
                />
              </div>
            </div>
            <div className={style.dataGroup1Container}>
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
        </div>
      )}
      <div className={style.backgroundSVGContainer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className={style.backgroundSVG}
        >
          <path
            fill="#B0E212"
            fillOpacity="1"
            d="M0,96L60,133.3C120,171,240,245,360,272C480,299,600,277,720,240C840,203,960,149,1080,
          122.7C1200,96,1320,96,1380,96L1440,96L1440,320L1380,320C1320,320,1200,320,1080,
          320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  )
}

export default SignUpEmpresa
