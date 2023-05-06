import React from "react"
import Button from "../../components/Boton/Button"
import userSvg from "../../assets/user.svg"
import corpSvg from "../../assets/corp.svg"
import ButtonImage from "../../components/ButtonImage/ButtonImage"
import styles from "./SignUp.module.css"

function LogIn() {
  return (
    <div className={styles.signUpCointainer}>
      <h1>UniEmpleos</h1>
      <div className={styles.opciones}>
        <ButtonImage src={userSvg} alt="user" text="Para mí" textColor="#000" />
        <ButtonImage
          src={corpSvg}
          alt="corporation"
          text="Para mi empresa"
          textColor="#000"
        />
      </div>
      <div className={styles.buttonContainer}>
        <Button label="Iniciar sesión" size="large" textColor="#000" />
      </div>
    </div>
  )
}

export default LogIn
