import React, { useEffect, useState } from "react"
import { useStoreon } from "storeon/react"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import { ca } from "date-fns/locale"
import style from "./EditProfileEstudiante.module.css"
import ComponentInput from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import DropDown from "../../components/dropDown/DropDown"
import { Header } from "../../components/Header/Header"
import { navigate } from "../../store"
import useApi from "../../Hooks/useApi"
import useIsImage from "../../Hooks/useIsImage"
import ImageUploader from "../../components/ImageUploader/ImageUploader"
import Popup from "../../components/Popup/Popup"
import ImageDirectUploader from "@components/ImageDirectUploader/ImageDirectUploader.jsx"
import API_URL from "@/api.js"

const animatedComponents = makeAnimated()

const EditProfileEstudiante = () => {
  const { user } = useStoreon("user")
  const api = useApi()
  const isImage = useIsImage()
  const apiCareers = useApi()
  const publishChanges = useApi()

  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [edad, setEdad] = useState("")
  const [carrera, setCarrera] = useState("")
  const [carreraId, setCarreraId] = useState(1)
  const [universidad, setUniversidad] = useState("")
  const [telefono, setTelefono] = useState("")
  const [semestre, setSemestre] = useState(1)
  const [uploadedImage, setUploadedImage] = useState("")
  const [updatedImage, setUpdatedImage] = useState("")
  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")
  const [typePopUp, setTypePopUp] = useState(1)

  const [carreras, setCarreras] = useState([])

  const semestres = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" },
    { value: 10, label: "10" },
    { value: 11, label: "11" },
    { value: 12, label: "12" },
  ]

  const handleSemestre = (e) => {
    setSemestre(e.value)
  }

  useEffect(() => {
    if (api.data) {
      const { usuario } = api.data
      const fotoUrl = API_URL + "/api/uploads/" + usuario.foto
      setNombre(usuario.nombre)
      setApellido(usuario.apellido)
      const date = new Date(usuario.nacimiento)
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
      const day = date.getDate().toString().padStart(2, "0")
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const year = date.getFullYear().toString()
      const formattedDate = `${year}-${month}-${day}`
      setEdad(formattedDate)
      carreras.forEach((e) => {
        if (e.value === usuario.carrera.toString()) {
          setCarrera(e.label)
        }
      })
      setUniversidad(usuario.universidad)
      setTelefono(usuario.telefono)
      setSemestre(usuario.semestre)
      setUploadedImage(fotoUrl)
    }
  }, [api.data])

  useEffect(() => {
    if (apiCareers.data) {
      const { careers } = apiCareers.data
      const dataCarreras = careers.map((e) => ({
        value: e.id_carrera.toString(),
        label: e.nombre,
      }))
      setCarreras(dataCarreras)
    }
  }, [apiCareers.data])

  useEffect(() => {
    api.handleRequest("GET", "/users/")
    apiCareers.handleRequest("GET", "/careers")
  }, [])

  useEffect(() => {
    if (updatedImage !== "") {
      const fotoUrl = API_URL + "/api/uploads/" + updatedImage
      console.log("New image ", fotoUrl)
      setUploadedImage(fotoUrl)
    }
  }, [updatedImage])

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
      case "carrera":
        setCarrera(e.target.value)
        break
      case "universidad":
        setUniversidad(e.target.value)
        break
      case "telefono":
        if (e.target.value.length < 9) {
          setTelefono(e.target.value)
        }
        break
      default:
        break
    }
  }

  const handleTypeSelect = (e) => {
    setCarrera(e.label)
    setCarreraId(parseInt(e.value, 10))
  }

  const handleButton = async () => {
    if (
      nombre === "" ||
      apellido === "" ||
      edad === "" ||
      carrera === "" ||
      universidad === "" ||
      telefono === ""
    ) {
      setTypePopUp(2)
      setError("Todos los campos son obligatorios")
      setWarning(true)
    } else if (telefono.length < 8) {
      setTypePopUp(2)
      setError("Telefono invalido")
      setWarning(true)
    } else {
      const apiResponse = await publishChanges.handleRequest(
        "PUT",
        "/students/update",
        {
          nombre,
          apellido,
          nacimiento: edad,
          carrera: carreraId,
          universidad,
          telefono,
          semestre,
          cv: "",
          foto: uploadedImage,
          correo: user.id_user,
        }
      )
      if (apiResponse.status === 200) {
        navigate("/profile")
      } else {
        setTypePopUp(1)
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
      setTypePopUp(2)
      setError("El archivo debe ser una imagen")
      setWarning(true)
    }
  }

  const uploadFile = async () => {
    event.preventDefault()
    const file = document.getElementById("file").files[0]

    if (file) {
      const updated = await api.updateProfilePicture(file)
      if (updated.status === 200) {
        console.log("Updated", updated.data.filename)
        setUpdatedImage(updated.data.filename)
        window.location.reload()
      } else {
        setTypePopUp(2)
        setError("Upss... No se pudo actualizar tu foto de perfil, intenta mas tarde")
        setWarning(true)
      }
    } else {
      setTypePopUp(2)
      setError("Debes seleccionar un archivo")
      setWarning(true)
    }
  }

  return (
    <div className={style.defaultContainer}>
      <Popup
        message={error}
        status={warning}
        style={typePopUp}
        close={() => setWarning(false)}
      />
      <div className={style.headerContainer}>
        <Header userperson="student" />
      </div>
      <div className={style.imgContainer}>
        <img
          src={uploadedImage}
          alt="profile"
        />
      </div>
      <div className={style.editProfileContainer}>
        <div className={style.inputsContainer}>
          <ImageDirectUploader uploader={uploadFile} />
          <div className={style.inputSubContainer}>
            <span>Nombres</span>
            <ComponentInput
              value={nombre}
              name="nombres"
              type="text"
              placeholder="Juan"
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputSubContainer}>
            <span>Apellidos</span>
            <ComponentInput
              value={apellido}
              name="apellidos"
              type="text"
              placeholder="Heredia"
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputSubContainer}>
            <span>Fecha de nacimiento</span>
            <ComponentInput
              value={edad}
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
              <span>Carrera</span>
              <Select
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused ? "#a08ae5" : "grey",
                    color: "black",
                  }),
                  option: (baseStyles) => ({
                    ...baseStyles,
                    color: "black",
                  }),
                }}
                name="carrera"
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "#94bd0f",
                    primary: "#a08ae5",
                  },
                })}
                defaultValue={carrera}
                options={carreras}
                formatGroupLabel={carreras}
                components={animatedComponents}
                value={carreras.find((option) => option.label === carrera)}
                onChange={handleTypeSelect}
              />
            </div>
            <div className={style.inputSubContainerDataGroup1}>
              <span>Universidad</span>
              <ComponentInput
                value={universidad}
                name="universidad"
                type="text"
                placeholder="Universidad de San Carlos"
                onChange={handleInputsValue}
              />
            </div>
            <div className={style.inputSubContainerDataGroup1}>
              <span>Semestre</span>
              <Select
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused ? "#a08ae5" : "grey",
                    color: "black",
                  }),
                  option: (baseStyles) => ({
                    ...baseStyles,
                    color: "black",
                  }),
                }}
                name="semestre"
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "#94bd0f",
                    primary: "#a08ae5",
                  },
                })}
                defaultValue={semestre}
                options={semestres}
                formatGroupLabel={semestres}
                value={semestres.filter((option) => option.value === semestre)}
                onChange={handleSemestre}
              />
            </div>
          </div>
          <div className={style.buttonContainer}>
            <Button label="Guardar" onClick={handleButton} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfileEstudiante
