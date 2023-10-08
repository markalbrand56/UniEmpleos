import Joi from "joi"
import React, { useEffect, useState } from "react"
import { useStoreon } from "storeon/react"
import useConfig from "../../Hooks/Useconfig"
import styles from "./PostulationsEmpresa.module.css"
import InfoTab from "../../components/InfoTab/InfoTab"
import { Header } from "../../components/Header/Header"
import { navigate } from "../../store"
import useApi from "../../Hooks/useApi"
import Popup from "../../components/Popup/Popup"

const schema = Joi.object({
  token: Joi.string().required(),
  idoffert: Joi.string().required(),
  id_user: Joi.string().required(),
})

const PostulationsEmpresa = () => {
  const form = useConfig(schema, {
    token: "a",
    idoffert: "a",
    id_user: "a",
  })

  const { user } = useStoreon("user")
  const api = useApi()
  const obtainPostulantes = useApi()

  const [dataa, setData] = useState([])
  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")
  const [typeError, setTypeError] = useState(1)

  useEffect(() => {
    if (api.data) {
      const { offers } = api.data
      setData(offers)
    }
  }, [api.data])

  useEffect(() => {
    api.handleRequest("POST", "/offers/company", {
      id_empresa: user.id_user,
    })
  }, [])

  const saveidlocalstorage = (id) => {
    if (form.values.idoffert !== "a" || form.values.idoffert !== "undefined") {
      navigate(`/postulationdetails/${id}`)
    } else
      alert(
        "No se pudo guardar el id de la oferta, por favor intentelo de nuevo"
      )
  }

  const handleVerPostulantes = async (id) => {
    const datos = await obtainPostulantes.handleRequest(
      "POST",
      "/offers/applicants",
      {
        id_oferta: parseInt(id, 10),
      }
    )
    if (datos.data) {
      navigate(`/postulantes/${id}`)
    } else {
      setTypeError(2)
      setError("La oferta no tiene postulantes")
      setWarning(true)
    }
  }

  return (
    <div className={styles.containePostulation}>
      <Header userperson="company" />
      <Popup
        message={error}
        status={warning}
        style={typeError}
        close={() => setWarning(false)}
      />
      {api.data ? (
        <div className={styles.containerinfoprincipal}>
          {dataa.map((postulation) => (
            <InfoTab
              title={postulation.puesto}
              area={postulation.nombre_carreras}
              salary={`Q.${postulation.salario}.00`}
              company={postulation.nombre_empresa}
              labelbutton="Ver más"
              onClick={() => {
                saveidlocalstorage(postulation.id_oferta)
              }}
              verPostulantes={() => {
                handleVerPostulantes(postulation.id_oferta)
              }}
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

export default PostulationsEmpresa
