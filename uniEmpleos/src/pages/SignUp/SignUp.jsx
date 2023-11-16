import React from "react"
import ButtonImage from "../../components/ButtonImage/ButtonImage"
import styles from "./SignUp.module.css"
import Logo from "../../components/Logo/Logo"
import { navigate } from "../../store"
import { useTranslation } from "react-i18next"

const LogIn = () => {
  const { t } = useTranslation()
  const handleCorpClick = () => {
    navigate("/signupempresa")
  }
  const handleUserClick = () => {
    navigate("/signupestudiante")
  }
  return (
    <div className={styles.signUpCointainer}>
      <div className={styles.logo}>
        <Logo src="/images/Ue_2.svg" size={200} />
      </div>
      <div className={styles.opciones}>
        <ButtonImage
          src="/images/user.svg"
          alt="user"
          text={t("signUp.student")}
          textColor="#000"
          onClick={handleUserClick}
        />
        <ButtonImage
          src="/images/corp.svg"
          alt="corporation"
          text={t("signUp.enterprise")}
          textColor="#000"
          onClick={handleCorpClick}
        />
      </div>
    </div>
  )
}

export default LogIn
