import react, { useState, useEffect } from "react"
import useApi from "../../Hooks/useApi"
import { useStoreon } from "storeon/react"
import Header from "../../components/Header/Header"
import InfoTab from "../../components/InfoTab/InfoTab"
import styles from "./PostulationsEstudent.module.css"

const PostulationsEstudent = () => {
  const api = useApi()
  const { user } = useStoreon("user")

  const obtainPostulations = () => {
    api.handleRequest("GET", "/postulations/getFromStudent")
  }

  useEffect(() => {
    obtainPostulations()
  }, [])

  const eliminarPostulacion = (id) => {
    obtainPostulations()
    console.log("eliminando postulacion")
  }

  return (
    <div className={styles.main}>
      <Header />
      {api.data ? (
        <div className={styles.mainInfoContainer}>
          {api.data.postulations.map((postulation) => (
            <InfoTab
              key={postulation.id_oferta}
              title={postulation.puesto}
              salary={`Q.${postulation.salario}.00`}
              labelbutton="Eliminar Postulación"
              onClick={() => eliminarPostulacion(postulation.id_oferta)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.mainInfoContainer}>
          <h1>No se ha postulado a ninguna oferta</h1>
        </div>
      )}
    </div>
  )
}

export default PostulationsEstudent
