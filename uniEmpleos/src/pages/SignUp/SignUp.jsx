import React from "react"
import Button from "../../components/Boton/Button"
import userSvg from "../../assets/user.svg"
import corpSvg from "../../assets/corp.svg"
import logoSvg from "../../assets/Ue_1.svg"
import ButtonImage from "../../components/ButtonImage/ButtonImage"
import styles from "./SignUp.module.css"
import Logo from "../../components/Logo/Logo"

function LogIn() {
  return (
    <div className={styles.signUpCointainer}>
      <div className={styles.logo}>
        <Logo src={logoSvg} size={200} />
      </div>
      <div className={styles.opciones}>
        <ButtonImage src={userSvg} alt="user" text="Para mí" textColor="#000" />
        <ButtonImage
          src={corpSvg}
          alt="corporation"
          text="Para mi empresa"
          textColor="#000"
        />
      </div>
    </div>
  )
}

export default LogIn
