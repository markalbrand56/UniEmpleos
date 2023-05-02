import React from "react"
import ComponentInput from "../../components/Input/Input"
import Button from "../../components/Boton/Button"
import styles from "./Login.module.css"

function LogIn() {
  return (
    <div className={styles.logInCointainer}>
      <h1>UniEmpleos</h1>
      <div>
        <ComponentInput
          name="usuario"
          type="text"
          placeholder="Ingrese su usuario"
        />
        <ComponentInput
          name="password"
          type="password"
          placeholder="Ingrese su contraseña"
        />
        <Button label="Iniciar sesión" />
        <a href="/registro">¿Eres nuevo? Únete al equipo</a>
      </div>
    </div>
  )
}

export default LogIn
