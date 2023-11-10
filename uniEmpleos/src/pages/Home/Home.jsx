import React from "react"
import { Player } from "@lottiefiles/react-lottie-player"
import styles from "./Home.module.css"
import Infocontainer from "../../components/Infocontainer/Infocontainer"
import Button from "../../components/Button/Button"
import { navigate } from "../../store"
import HeaderHome from "../../components/HeaderHome/HeaderHome"
import students from "./students.json"

const Home = () => {
  const handleNav = (path) => {
    navigate(path)
  }

  return (
    <div className={styles.homeContainer}>
      <div className={styles.topcontent}>
        <HeaderHome />
      </div>
      <div className={styles.homeContent}>
        <div className={styles.image}>
          <div className={styles.title}>
            <h1>Uni</h1>
          </div>
          <div className={styles.lottie}>
            <Player autoplay loop src={students}
              style={{ height: "500px", width: "500px" }}
            />
          </div>
          <div className={styles.titlephone}>
            <h1>UniEmpleos</h1>
          </div>
          <div className={styles.lottiephone}>
            <Player autoplay loop src={students}
              style={{ height: "400px", width: "400px" }}
            />
          </div>
          <div className={styles.title}>
            <h1>Empleos</h1>
          </div>
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
