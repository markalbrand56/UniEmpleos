import React from "react"
import styles from "./Home.module.css"
import Infocontainer from "../../components/Infocontainer/Infocontainer"
import Button from "../../components/Button/Button"
import { navigate } from "../../store"

const Home = () => {
  const handleNav = (path) => {
    console.log("path", path)
    navigate(path)
  }

  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeContent}>
        <div className={styles.topcontent}>
          <img src="/images/Ue_2.svg" alt="Logo" />
          <div className={styles.button}>
            <Button
              primary
              label="Iniciar Sesión"
              backgroundColor="transparent"
              size="large"
              onClick={(event) => {
                event.preventDefault()
                handleNav("/login")
              }}
            />
            <Button
              primary
              label="Registrarse"
              backgroundColor="#A08AE5"
              size="large"
              noborder
              onClick={(event) => {
                event.preventDefault()
                handleNav("/signup")
              }}
            />
          </div>
        </div>
        <div className={styles.image}>
          <img src="/images/Uniempleos.png" alt="Uniempleos" />
        </div>
        <div className={styles.info}>
          <Infocontainer
            title="¿Qué es UniEmpleos?"
            text="UniEmpleos es una plataforma que permite a los estudiantes de distintas
             Universidades de Guatemala encontrar ofertas de trabajo y prácticas profesionales."
            backgroundColor="#A08AE5"
            textColor="#fff"
          />
          <Infocontainer
            title="¿Cómo funciona?"
            text="Las empresas publican sus ofertas de trabajo y los estudiantes 
            pueden postular a ellas. Las empresas pueden ver los perfiles de los estudiantes y contactarlos."
            backgroundColor="#94BD0F"
            textColor="#fff"
          />
        </div>
      </div>
    </div>
  )
}

export default Home
