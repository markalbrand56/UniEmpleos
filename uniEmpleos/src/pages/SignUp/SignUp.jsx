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
        <ButtonImage src={userSvg} alt="user" text="Para mí" />
        <ButtonImage src={corpSvg} alt="corporation" text="Para mi empresa" />
      </div>
    </div>
  )
}

export default LogIn
