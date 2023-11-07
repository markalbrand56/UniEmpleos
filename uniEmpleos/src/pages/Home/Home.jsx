import React from "react"
import styles from "./Home.module.css"
import Infocontainer from "../../components/Infocontainer/Infocontainer"
import Button from "../../components/Button/Button"
import { navigate } from "../../store"
import HeaderHome from "../../components/HeaderHome/HeaderHome"

const Home = () => {
  const handleNav = (path) => {
    navigate(path)
  }

  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeContent}>
        <div className={styles.topcontent}>
          <HeaderHome />
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
