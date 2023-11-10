import React, { useState, useEffect } from "react"
import { navigate } from "../../store"
import ComponentInput from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import styles from "./Login.module.css"
import Popup from "../../components/Popup/Popup"
import API_URL from "../../api"
import { useStoreon } from "storeon/react"

const LogIn = () => {
  const { dispatch } = useStoreon("user")

  const [emailInput, setEmailInput] = useState("")
  const [passInput, setPassInput] = useState("")
  const [warning, setWarning] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [typePopUp, setTypePopUp] = useState(1)
  const [error, setError] = useState("")

  // Teniendo el DPI y la contraseña,necesitamos que nos devuelva un objeto usuario
  const logIn = async () => {
    const body = {
      usuario: emailInput,
      contra: passInput,
    }
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const datos = await response.json() // Recibidos

    if (datos.status === 200) {
      // Estado global
      const { token, role } = datos.data
      dispatch("user/config", {
        token,
        role,
        id_user: emailInput,
      })
      if (role === "student") {
        navigate("/profile")
      } else if (role === "enterprise") {
        navigate("/postulacionempresa")
      } else if (role === "admin") {
        navigate("/profileadmin")
      }
    } else if (datos.status === 403){
      setTypePopUp(1)
      setError("Cuenta deshabilitada. Contacte al administrador")
      setWarning(true)
    } else {
      setTypePopUp(1)
      setError("Credenciales incorrectas. Inténtelo de nuevo")
      setWarning(true)
    }
  }

  const handleCorreo = (event) => {
    setEmailInput(event.target.value)
  }

  const handlePass = (event) => {
    setPassInput(event.target.value)
  }

  const handlePassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={styles.logInCointainer}>
      <Popup
        message={error}
        status={warning}
        style={typePopUp}
        close = {() => setWarning(false)}
      />
      <h1>UniEmpleos</h1>
      <div className={styles.inputsContainer}>
        <div className={styles.usuarioContainer}>
          <span>Ingrese su correo</span>
          <ComponentInput
            name="correo"
            type="text"
            placeholder="uni@gmail.com"
            onChange={handleCorreo}
          />
        </div>
        <div className={styles.usuarioContainer}>
          <span>Ingrese su contraseña</span>
          <ComponentInput
            name="password"
            type="password"
            placeholder="micontraseña123"
            onChange={handlePass}
            eye = {true}
            onClickButton = {handlePassword}
            isOpen={showPassword}
          />
        </div>
        <Button
          label="Iniciar sesión"
          onClick={(event) => {
            event.preventDefault()
            logIn()
          }}
        />
        <a href="/signup">
          ¿Eres nuevo? <span> Únete al equipo </span>
        </a>
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

export default LogIn
