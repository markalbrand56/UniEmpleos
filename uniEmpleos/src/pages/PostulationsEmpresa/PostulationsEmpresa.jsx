import React, { useEffect, useState } from "react"
import Joi from "joi"
import styles from "./PostulationsEmpresa.module.css"
import InfoTab from "../../components/InfoTab/InfoTab"
import { Header } from "../../components/Header/Header"
import useConfig from "../../Hooks/Useconfig"
import API_URL from "../../api"

const schema = Joi.object({
  token: Joi.string().required(),
})

const PostulationsEmpresa = () => {
  const form = useConfig(schema, {
    token: "a",
  })
  const [dataa, setData] = useState([])

  const configureData = async () => {
    const response = await fetch(`${API_URL}/api/postulations/previews`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const datos = await response.json()
    console.log(datos)
    setData(datos)
  }

  useEffect(() => {
    configureData()
  }, [])

  console.log(form.values.token)

  return (
    <div className={styles.containePostulation}>
      <Header userperson="company" />
      {dataa.status === 200 ? (
        <div className={styles.containerinfomain}>
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
