import React, { useState, useEffect } from "react"
import { useStoreon } from "storeon/react"
import { Player } from "@lottiefiles/react-lottie-player"
import useApi from "../../Hooks/useApi"
import Header from "../../components/Header/Header"
import InfoTab from "../../components/InfoTab/InfoTab"
import styles from "./PostulationsEstudent.module.css"
import Popup from "../../components/Popup/Popup"
import upload from "./upload.json"

const PostulationsEstudent = () => {
  const api = useApi()
  const deletePostulation = useApi()
  const { user } = useStoreon("user")
  const [typePopUp, setTypePopUp] = useState(1)
  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")
  const [postulaciones, setPostulaciones] = useState([])

  const obtainPostulations = async () => {
    const datos = await api.handleRequest("GET", "/postulations/getFromStudent")
    if (datos.status === 200) {
      setPostulaciones(datos.data)
    } else {
      setTypePopUp(1)
      setError("Error al obtener las postulaciones")
      setWarning(true)
    }
  }

  useEffect(() => {
    obtainPostulations()
  }, [])

  const eliminarPostulacion = async (id) => {
    const respuesta = await deletePostulation.handleRequest(
      "DELETE",
      `/postulations/?id_postulacion=${id}`
    )
    if (respuesta.status === 200) {
      setTypePopUp(3)
      setError("Postulación eliminada con éxito")
      setWarning(true)
      obtainPostulations()
    } else {
      setTypePopUp(1)
      setError("No se pudo eliminar la postulación")
      setWarning(true)
    }
  }

  return (
    <div className={styles.main}>
      <Header />
      <Popup
        message={error}
        status={warning}
        style={typePopUp}
        close={() => setWarning(false)}
      />
      {postulaciones.postulations && postulaciones.postulations.length > 0 ? (
        <div className={styles.mainInfoContainer}>
          {postulaciones.postulations.map((postulation) => (
            <InfoTab
              key={postulation.id_oferta}
              title={postulation.puesto}
              salary={`Q.${postulation.salario}.00`}
              labelbutton="Eliminar Postulación"
              onClick={() => eliminarPostulacion(postulation.id_postulacion)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.containerinfomain}>
          <h1 style={{ color: "#000" }}>No se ha postulado a ninguna oferta</h1>
          <Player
            src={upload}
            className="player"
            loop
            autoplay
            style={{ height: "400px", width: "400px" }}
          />
          <a href="/profile" className={styles.buttonapplyoffer}>
            Postularme
          </a>
        </div>
      )}
    </div>
  )
}

export default PostulationsEstudent
