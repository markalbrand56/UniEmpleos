import React from "react"
import styles from "./Home.module.css"
import { Header } from "../../components/Header/Header"

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <Header user="jimena" userperson="student" />
      <div className={styles.homeContent}>
        <div className={styles.homeText}>
          <h1>UniEmpleos</h1>
          <p>
            UniEmpleos es una plataforma que conecta a estudiantes y empresas
            para generar oportunidades de empleo.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
