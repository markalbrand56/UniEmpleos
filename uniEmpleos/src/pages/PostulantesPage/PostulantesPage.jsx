import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import useApi from "../../Hooks/useApi"
import InfoStudent from "../../components/InfoStudent/InfoStudent"
import style from "./PostulantesPage.module.css"
import Popup from "../../components/Popup/Popup"
import { Header } from "../../components/Header/Header"
import { navigate } from "../../store"
import API_URL from "../../api"
import fotoPFP from "/images/pfp.svg"
import Loader from "../../components/Loader/Loader"

const PostulantesPage = ({ id }) => {
  const api = useApi()
  const [response, setResponse] = useState([])
  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")
  const [typeError, setTypeError] = useState(1)
  const [loading, setLoading] = useState(false)

  const obtainPostulantes = async () => {
    setLoading(true)
    const datos = await api.handleRequest("POST", "/offers/applicants", {
      id_oferta: parseInt(id, 10),
    })
    if (datos.status === 200) {
      setResponse(datos)
    } else {
      setTypeError(1)
      setError("Error al obtener los postulantes")
      setWarning(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    obtainPostulantes()
  }, [])

  const handleClickUsuario = (idUsuario) => {
    navigate(`/publicprofile/${idUsuario}-${id}`)
  }

  return (
    <div className={style.mainContainer}>
      <Header />
      <Popup
        message={error}
        status={warning}
        style={typeError}
        close={() => setWarning(false)}
      />
      <h1>Postulantes</h1>
      <div className={style.containerPostulants}>
        {loading ? (
          <Loader size={100} />
        ) : (
          <div className={style.infoStudentContainer}>
            {response.data ? (
              response.data.map((postulante) => (
                <InfoStudent
                  key={postulante.id_estudiante}
                  nombre={postulante.nombre}
                  apellido={postulante.apellido}
                  universidad={postulante.universidad}
                  pfp={
                    postulante.foto === ""
                      ? fotoPFP
                      : `${API_URL}/api/uploads/${postulante.foto}`
                  }
                  onClick={() => handleClickUsuario(postulante.id_estudiante)}
                />
              ))
            ) : (
              <span className={style.sinPostulantes}>No hay postulantes</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

PostulantesPage.propTypes = {
  id: PropTypes.string.isRequired,
}

export default PostulantesPage
