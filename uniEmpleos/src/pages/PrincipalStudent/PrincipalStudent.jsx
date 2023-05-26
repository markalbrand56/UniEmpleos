import React, { useEffect, useState } from "react"
import Joi from "joi"
import styles from "./PrincipalStudent.module.css"
import InfoTab from "../../components/InfoTab/InfoTab"
import { navigate } from "../../store"
import { Header } from "../../components/Header/Header"
import useConfig from "../../Hooks/Useconfig"
import API_URL from "../../api"

const schema = Joi.object({
  token: Joi.string().required(),
  idoffert: Joi.string().required(),
  id_user: Joi.string().required(),
})

const PrincipalStudent = () => {
  const form = useConfig(schema, {
    token: "a",
    idoffert: "a",
    id_user: "a",
  })

  /* useEffect(() => {
    console.log("tokenPrincipal", form.values.token)
  }, [form.values.token]) */

  const [dataa, setData] = useState([])

  const configureData = async () => {
    const response = await fetch(`${API_URL}/api/postulations/previews`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const datos = await response.json()
    setData(datos)
  }

  useEffect(() => {
    configureData()
  }, [])

  /* useEffect(() => {
    console.log("idoffertPrincipal", form.values.id_user)
  }, [form.values.id_user]) */

  const saveidlocalstorage = (id) => {
    if (form.values.idoffert !== "a" || form.values.idoffert !== "undefined") {
      navigate(`/postulacion/${id}`)
    } else
      alert(
        "No se pudo guardar el id de la oferta, por favor intentelo de nuevo"
      )
  }

  return (
    <div className={styles.container}>
      <Header userperson="student" />
      {dataa.status === 200 ? (
        <div className={styles.containerinfomain}>
          {dataa.data.postulations.map((postulation) => (
            <InfoTab
              title={postulation.puesto}
              area={postulation.nombre_carreras}
              salary={`Q.${postulation.salario}.00`}
              company={postulation.nombre_empresa}
              labelbutton="Postularme"
              onClick={() => saveidlocalstorage(postulation.id_oferta)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.containerinfomain}>
          <h1>No hay postulaciones</h1>
        </div>
      )}
    </div>
  )
}

export default PrincipalStudent
