import React, { useEffect, useState } from "react"
import Joi from "joi"
import useConfig from "../../Hooks/Useconfig"
import style from "./EditProfileEstudiante.module.css"
import ComponentInput from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import API_URL from "../../api"
import DropDown from "../../components/dropDown/DropDown"

const schema = Joi.object({
  token: Joi.string().required(),
})

const EditProfileEstudiante = () => {
  const form = useConfig(schema, {
    token: "a",
  })

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

  const [carreras, setCarreras] = useState([])

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

  const handleSemestre = (e) => {
    setSemestre(e.target.value)
  }

  const handleDropdown = (e) => {
    setCarrera(e.target.value)
  }

  const obtainUserData = async () => {
    const response = await fetch(`${API_URL}/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const datos = await response.json()
    if (datos.status === 200) {
      console.log(datos.data)
    }
  }

  const obtainCarreras = async () => {
    const response = await fetch(`${API_URL}/api/careers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const datos = await response.json()
    if (datos.status === 200) {
      const dataCarreras = datos.data.carrers.map((e) => ({
        value: e.id_carrera.toString(),
        label: e.nombre,
      }))
      setCarreras(dataCarreras)
    }
  }

  useEffect(() => {
    obtainUserData()
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
        if (e.target.value.length < 13) {
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
  /* useEffect(() => {
    console.log(
      nombre,
      apellido,
      edad,
      dpi,
      correo,
      password,
      carrera,
      universidad,
      telefono,
      semestre
    )
  }, [
    nombre,
    apellido,
    edad,
    dpi,
    correo,
    password,
    carrera,
    universidad,
    telefono,
    semestre,
  ]) */

  const handleButton = () => {
    console.log("Registrado")
  }

  return (
    <div className={style.defaultContainer}>
      <div className={style.imgContainer}>
        <img src="/images/Ue_2.svg" alt="Foto de perfil" />
      </div>
      <div className={style.editProfileContainer}>
        <div className={style.inputsContainer}>
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
                value={correo}
                name="correo"
                type="text"
                placeholder="uni@uni.com"
                onChange={handleInputsValue}
              />
            </div>
            <div className={style.inputSubContainerDataGroup1}>
              <span>Contraseña</span>
              <ComponentInput
                value={password}
                name="password"
                type="password"
                placeholder="micontraseña"
                onChange={handleInputsValue}
              />
            </div>
            <div className={style.inputSubContainerDataGroup1}>
              <span>Carrera</span>
              <DropDown
                opciones={carreras}
                value={carrera}
                onChange={handleDropdown}
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
              <DropDown
                opciones={semestres}
                value={semestre}
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
