import Joi from "joi"
import React, { useEffect, useState } from "react"
import { useStoreon } from "storeon/react"
import { set } from "date-fns"
import useConfig from "../../Hooks/Useconfig"
import styles from "./PrincipalAdmin.module.css"
import InfoTab from "../../components/InfoTab/InfoTab"
import { Header } from "../../components/Header/Header"
import { navigate } from "../../store"
import useApi from "../../Hooks/useApi"
import Popup from "../../components/Popup/Popup"
import Loader from "../../components/Loader/Loader"

const schema = Joi.object({
  token: Joi.string().required(),
  idoffert: Joi.string().required(),
  id_user: Joi.string().required(),
})

const PrincipalAdmin = () => {
  const form = useConfig(schema, {
    token: "a",
    idoffert: "a",
    id_user: "a",
  })

  const { user } = useStoreon("user")
  const api = useApi()
  const [dataa, setData] = useState([])
  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")
  const [typeError, setTypeError] = useState(1)
  const [loading, setLoading] = useState(false)

  const obtenerPreviews = async () => {
    setLoading(true)
    const datos = await api.handleRequest("GET", "/postulations/previews", {
      id_empresa: user.id_user,
    })
    if (datos.status === 200) {
      if (datos.data.postulations) {
        setData(datos.data.postulations)
      } else {
        setTypeError(2)
        setError("No tiene niguna oferta activa")
        setWarning(true)
      }
    } else {
      setTypeError(1)
      setError("Ups, algo salio mal al obtener las ofertas")
      setWarning(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    obtenerPreviews()
  }, [])

  return (
    <div className={styles.mainContainer}>
      <Header userperson="company" />
      <Popup
        message={error}
        status={warning}
        style={typeError}
        close={() => setWarning(false)}
      />
      {loading ? (
        <div className={styles.loadingContainer}>
          <Loader size={100} />
        </div>
      ) : api.data ? (
        <div className={styles.containerinfoprincipal}>
          {dataa.map((postulation) => (
            <InfoTab
              title={postulation.puesto}
              area={postulation.nombre_carreras}
              salary={`Q.${postulation.salario}.00`}
              company={postulation.nombre_empresa}
              labelbutton="Ver más"
            />
          ))}
        </div>
      ) : (
        <div className={styles.containerinfomain}>
          <h1>No tiene niguna oferta activa</h1>
        </div>
      )}
    </div>
  )
}

export default PrincipalAdmin
