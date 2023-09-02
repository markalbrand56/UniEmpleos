import React, { useEffect, useState } from "react"
import style from "./SignUpEstudiante.module.css"
import ComponentInput from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import { navigate } from "../../store"
import API_URL from "../../api"
import DropDown from "../../components/dropDown/DropDown"
import ImageUploader from "../../components/ImageUploader/ImageUploader"
import Popup from "../../components/Popup/Popup"
import useIsImage from "../../Hooks/useIsImage"
import useApi from "../../Hooks/useApi"

const SignUpEstudiante = () => {
  const isImage = useIsImage()
  const api = useApi()

  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [edad, setEdad] = useState("")
  const [dpi, setDpi] = useState("")
  const [correo, setCorreo] = useState("")
  const [password, setPassword] = useState("")
  const [carrera, setCarrera] = useState("")
  const [universidad, setUniversidad] = useState("")
  const [telefono, setTelefono] = useState("")
  const [semestre, setSemestre] = useState("1")
  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")

  const [carreras, setCarreras] = useState([])
  const [uploadedImage, setUploadedImage] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const semestres = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
  ]

  const obtainCarreras = async () => {
    const response = await fetch(`${API_URL}/api/careers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const datos = await response.json()

    if (datos.status === 200) {
      const dataCarreras = datos.data.careers.map((e) => ({
        value: e.id_carrera.toString(),
        label: e.nombre,
      }))
      setCarreras(dataCarreras)
    }
  }

  useEffect(() => {
    obtainCarreras()
  }, [])

  const handleInputsValue = (e) => {
    switch (e.target.name) {
      case "nombres":
        setNombre(e.target.value)
        break
      case "apellidos":
        setApellido(e.target.value)
        break
      case "fechaNacimiento":
        setEdad(e.target.value)
        break
      case "dpi":
        if (e.target.value.length < 14) {
          setDpi(e.target.value)
        }
        break
      case "correo":
        setCorreo(e.target.value)
        break
      case "password":
        setPassword(e.target.value)
        break
      case "carrera":
        setCarrera(e.target.value)
        break
      case "telefono":
        if (e.target.value.length < 9) {
          setTelefono(e.target.value)
        }
        break
      case "universidad":
        setUniversidad(e.target.value)
        break
      default:
        break
    }
  }

  const handleDropdown = (e) => {
    setCarrera(e.target.value)
  }

  const handleSemestre = (e) => {
    setSemestre(e.target.value)
  }

  const handleButton = () => {
    navigate("/login")
  }

  const handlePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleSignUp = async () => {
    if (
      dpi === "" ||
      nombre === "" ||
      apellido === "" ||
      edad === "" ||
      correo === "" ||
      telefono === "" ||
      carrera === "" ||
      semestre === "" ||
      password === "" ||
      universidad === ""
    ) {
      setError("Todos los campos son obligatorios")
      setWarning(true)
    } else if (telefono.length < 8) {
      setError("Telefono invalido")
      setWarning(true)
    } else {
      const apiResponse = await api.handleRequest("POST", "/students", {
        dpi,
        nombre,
        apellido,
        nacimiento: edad,
        correo,
        telefono,
        carrera: parseInt(carrera, 10),
        semestre: parseInt(semestre, 10),
        cv: " ",
        foto: uploadedImage,
        contra: password,
        universidad,
      })
      if (apiResponse.status === 200) {
        navigate("/login")
      } else if (apiResponse.status === 409) {
        setError("El correo ya esta en uso")
        setWarning(true)
      } else {
        setError("Upss algo salio mal")
        setWarning(true)
      }
    }
  }

  const handleUploadFile = (image) => {
    const fileType = isImage(image)
    if (fileType) {
      setUploadedImage(image)
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
      <Popup
        message={error}
        status={warning}
        style={2}
        close={() => setWarning(false)}
      />
      <h1>UniEmpleos</h1>
      <div className={style.inputsContainer}>
        <div className={style.inputSubContainer}>
          <span>Nombres</span>
          <ComponentInput
            name="nombres"
            type="text"
            placeholder="Juan"
            onChange={handleInputsValue}
          />
        </div>
        <div className={style.inputSubContainer}>
          <span>Apellidos</span>
          <ComponentInput
            name="apellidos"
            type="text"
            placeholder="Heredia"
            onChange={handleInputsValue}
          />
        </div>
        <div className={style.inputSubContainer}>
          <span>Fecha de nacimiento</span>
          <ComponentInput
            name="fechaNacimiento"
            type="date"
            placeholder="2018-07-22"
            min="1940-01-01"
            max="2005-01-01"
            onChange={handleInputsValue}
          />
        </div>
        <div className={style.grupoDatos1}>
          <div className={style.inputSubContainerDataGroup1}>
            <span>DPI</span>
            <ComponentInput
              value={dpi}
              name="dpi"
              type="number"
              placeholder="3131480580502"
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputSubContainerDataGroup1}>
            <span>Telefono</span>
            <ComponentInput
              value={telefono}
              name="telefono"
              type="number"
              placeholder="34325456"
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputSubContainerDataGroup1}>
            <span>Correo</span>
            <ComponentInput
              name="correo"
              type="text"
              placeholder="uni@uni.com"
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputSubContainerDataGroup1}>
            <span>Contraseña</span>
            <ComponentInput
              name="password"
              type="password"
              placeholder="micontraseña123"
              onChange={handleInputsValue}
              eye={true}
              onClickButton={handlePassword}
              isOpen={showPassword}
            />
          </div>
          <div className={style.inputSubContainerDataGroup1}>
            <span>Carrera</span>
            <DropDown
              name="carrera"
              id="carrera"
              opciones={carreras}
              value={carrera}
              onChange={handleDropdown}
            />
          </div>
          <div className={style.inputSubContainerDataGroup1}>
            <span>Universidad</span>
            <ComponentInput
              name="universidad"
              type="text"
              placeholder="Universidad de San Carlos"
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputSubContainerDataGroup1}>
            <span>Semestre</span>
            <DropDown
              name="semester"
              id="semester"
              opciones={semestres}
              value={semestre}
              onChange={handleSemestre}
            />
          </div>
          <div className={style.inputSubContainerDataGroup1}>
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
        </div>
        <div className={style.buttonContainer}>
          <Button label="Registrarse" onClick={handleSignUp} />
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

export default SignUpEstudiante
