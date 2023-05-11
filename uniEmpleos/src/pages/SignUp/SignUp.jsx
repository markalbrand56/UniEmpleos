import React from "react"
import userSvg from "/images/user.svg"
import corpSvg from "/images/corp.svg"
import logoSvg from "/images/Ue_1.svg"
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
