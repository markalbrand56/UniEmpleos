import Joi from "joi"
import React, { useEffect, useState } from "react"
import { useStoreon } from "storeon/react"
import useConfig from "../../Hooks/Useconfig"
import styles from "./PostulationsEmpresa.module.css"
import InfoTab from "../../components/InfoTab/InfoTab"
import { Header } from "../../components/Header/Header"
import { navigate } from "../../store"
import useApi from "../../Hooks/useApi"

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

  const [dataa, setData] = useState([])

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
      console.log("ID", id)
      navigate(`/postulationdetails/${id}`)
    } else
      alert(
        "No se pudo guardar el id de la oferta, por favor intentelo de nuevo"
      )
  }

  return (
    <div className={styles.containePostulation}>
      <Header userperson="company" />
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
