import React, { useEffect, useState } from "react"
import Joi from "joi"
import styles from "./PostulationsEmpresa.module.css"
import InfoTab from "../../components/InfoTab/InfoTab"
import { Header } from "../../components/Header/Header"
import useConfig from "../../Hooks/Useconfig"
import API_URL from "../../api"

const schema = Joi.object({
  token: Joi.string().required(),
  id_user: Joi.string().required(),
})

const PostulationsEmpresa = () => {
  const form = useConfig(schema, {
    token: "a",
    id_user: " ",
  })
  const [dataa, setData] = useState([])

  const configureData = async () => {
    console.log ("TOKEEEEEN", form.values.token)
    const body = {
      id_empresa: form.values.id_user,
    }
    const response = await fetch(`${API_URL}/api/offers/company`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${form.values.token}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    console.log("data", data)
    setData(data)
  }

  useEffect(() => {
    configureData()
  }, [])

  console.log(form.values.token)

  return (
    <div className={styles.containePostulation}>
      <Header userperson="company" />
      {dataa.status === 200 ? (
        <div className={styles.containerinfoprincipal}>
          {dataa.data.postulations.map((postulation) => (
            <InfoTab
              title={postulation.puesto}
              area={postulation.nombre_carreras}
              salary={`Q.${postulation.salario}.00`}
              company={postulation.nombre_empresa}
              labelbutton="Postularme"
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
