import react, { useState, useEffect } from "react"
import useApi from "../../Hooks/useApi"
import { useStoreon } from "storeon/react"
import Header from "../../components/Header/Header"
import InfoTab from "../../components/InfoTab/InfoTab"
import styles from "./PostulationsEstudent.module.css"
import Popup from "../../components/Popup/Popup"

const PostulationsEstudent = () => {
  const api = useApi()
  const deletePostulation = useApi()
  const { user } = useStoreon("user")
  const [typePopUp, setTypePopUp] = useState(1)
  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")

  const obtainPostulations = () => {
    api.handleRequest("GET", "/postulations/getFromStudent")
  }

  useEffect(() => {
    obtainPostulations()
  }, [])

  const eliminarPostulacion = async (id) => {
    const respuesta = await deletePostulation.handleRequest("DELETE", "/postulations/?id_postulacion=" + id)
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
        close = {() => setWarning(false)}
      />
      {api.data ? (
        <div className={styles.mainInfoContainer}>
          {api.data.postulations.map((postulation) => (
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
        <div className={styles.mainInfoContainer}>
          <h1>No se ha postulado a ninguna oferta</h1>
        </div>
      )}
    </div>
  )
}

export default PostulationsEstudent
