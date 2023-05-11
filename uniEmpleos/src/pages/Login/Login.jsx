import React from "react"
import ComponentInput from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import styles from "./Login.module.css"

const LogIn = () => {
  return (
    <div className={styles.logInCointainer}>
      <h1>UniEmpleos</h1>
      <div className={styles.inputsContainer}>
        <div className={styles.usuarioContainer}>
          <span>Ingrese su correo</span>
          <ComponentInput
            name="correo"
            type="text"
            placeholder="jim@gmail.com"
          />
        </div>
        <div className={styles.contrasenaContainer}>
          <span>Ingrese su contraseña</span>
          <ComponentInput
            name="password"
            type="password"
            placeholder="micontraseña123"
          />
        </div>
        <Button label="Iniciar sesión" />
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
