import React, { useEffect } from "react"
import style from "./SignUpEstudiante.module.css"
import ComponentInput from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import { navigate } from "../../store"

const SignUpEstudiante = () => {
  const [nombre, setNombre] = React.useState("")
  const [apellido, setApellido] = React.useState("")
  const [edad, setEdad] = React.useState("")
  const [dpi, setDpi] = React.useState("")
  const [correo, setCorreo] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [carrera, setCarrera] = React.useState("")
  const [universidad, setUniversidad] = React.useState("")
  // const [cv, setCv] = React.useState("")
  // const [fotoPerfil, setFotoPerfil] = React.useState("")

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
        setDpi(e.target.value)
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
      default:
        break
    }
  }
  useEffect(() => {
    console.log(
      nombre,
      apellido,
      edad,
      dpi,
      correo,
      password,
      carrera,
      universidad
    )
  }, [nombre, apellido, edad, dpi, correo, password, carrera, universidad])

  const handleButton = () => {
    navigate("/login")
  }

  return (
    <div className={style.signUpCointainer}>
      <h1>UniEmpleos</h1>
      <div className={style.inputsContainer}>
        <div className={style.grupoDatos1}>
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
          <div className={style.inputSubContainer}>
            <span>DPI</span>
            <ComponentInput
              name="dpi"
              type="number"
              placeholder="3131480580502"
              onChange={handleInputsValue}
            />
          </div>

          <div className={style.inputSubContainer}>
            <span>Correo</span>
            <ComponentInput
              name="correo"
              type="text"
              placeholder="uni@uni.com"
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputSubContainer}>
            <span>Contraseña</span>
            <ComponentInput
              name="password"
              type="password"
              placeholder="micontraseña"
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputSubContainer}>
            <span>Carrera</span>
            <ComponentInput
              name="carrera"
              type="text"
              placeholder="ing. en sistemas"
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputSubContainer}>
            <span>Universidad</span>
            <ComponentInput
              name="universidad"
              type="text"
              placeholder="Universidad del Valle"
              onChange={handleInputsValue}
            />
          </div>
        </div>
        <div className={style.buttonContainer}>
          <Button label="Registrarse" onClick={handleButton} />
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