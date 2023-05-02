import React from "react"
import ComponentInput from "../../components/Input/Input"
import styles from "./Login.module.css"

function LogIn() {
  return (
    <div className={styles.logInCointainer}>
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
      </div>
    </div>
  )
}

export default LogIn
