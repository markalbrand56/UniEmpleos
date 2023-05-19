import React from "react"
import ButtonImage from "../../components/ButtonImage/ButtonImage"
import styles from "./SignUp.module.css"
import Logo from "../../components/Logo/Logo"
import { navigate } from "../../store"

const LogIn = () => {
  const handleCorpClick = () => {
    navigate("/signupempresa")
  }
  const handleUserClick = () => {
    navigate("/signupestudiante")
  }
  return (
    <div className={styles.signUpCointainer}>
      <div className={styles.logo}>
        <Logo src="/images/Ue_1.svg" size={200} />
      </div>
      <div className={styles.opciones}>
        <ButtonImage
          src="/images/user.svg"
          alt="user"
          text="Buscando empleo"
          textColor="#000"
          onClick={handleUserClick}
        />
        <ButtonImage
          src="/images/corp.svg"
          alt="corporation"
          text="Soy reclutador"
          textColor="#000"
          onClick={handleCorpClick}
        />
      </div>
    </div>
  )
}

export default LogIn
