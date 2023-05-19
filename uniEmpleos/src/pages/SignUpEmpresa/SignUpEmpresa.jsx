import React, { useEffect } from "react"
import style from "./SignUpEmpresa.module.css"
import ComponentInput from "../../components/Input/Input"
import TextArea from "../../components/textAreaAutosize/TextAreaAuto"
import Button from "../../components/Button/Button"
import { navigate } from "../../store"

const SignUpEmpresa = () => {
  const [nombre, setNombre] = React.useState("")
  const [correo, setCorreo] = React.useState("")
  const [detalles, setDetalles] = React.useState("")
  const [telefono, setTelefono] = React.useState("")
  const [password, setPassword] = React.useState("")

  const handleInputsValue = (e) => {
    switch (e.target.name) {
      case "nombre":
        setNombre(e.target.value)
        break
      case "detalles":
        setDetalles(e.target.value)
        break
      case "telefono":
        setTelefono(e.target.value)
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

  useEffect(() => {
    console.log(nombre, correo, detalles, telefono, password)
  }, [nombre, correo, detalles, telefono, password])

  return (
    <div className={style.signUpCointainer}>
      <h1>UniEmpleos</h1>
      <div className={style.inputsContainer}>
        <div className={style.grupoDatos1}>
          <div className={style.inputSubContainer}>
            <span>Nombre</span>
            <ComponentInput
              name="nombre"
              type="text"
              placeholder="miEmpresa.org"
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputSubContainer}>
            <span>Telefono</span>
            <ComponentInput
              name="telefono"
              type="number"
              placeholder="21212413"
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputSubContainer}>
            <span>Correo</span>
            <ComponentInput
              name="correo"
              type="text"
              placeholder="empresa@org.com"
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputSubContainer}>
            <span>Contraseña</span>
            <ComponentInput
              name="password"
              type="password"
              placeholder="miContraseña"
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputTextArea}>
            <span>Detalles</span>
            <TextArea
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

export default SignUpEmpresa
