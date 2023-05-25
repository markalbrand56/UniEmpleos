import React, { useEffect, useState } from "react"
import styles from "./PrincipalStudent.module.css"
import InfoTab from "../../components/InfoTab/InfoTab"
import { navigate } from "../../store"
import { Header } from "../../components/Header/Header"
import useConfig from "../../Hooks/Useconfig"
import Joi from "joi"
import API_URL from "../../api"

const schema = Joi.object({
  token: Joi.string().required(),
  idoffert: Joi.string().required(),
})

const PrincipalStudent = () => {
  const form = useConfig(schema, {
    token: "a",
    idoffert : "a"
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

  const saveidlocalstorage = (id) => {
    console.log("GUArdando id", id)
    form.setValue("idoffert", id)
    console.log(form.values.idoffert)
    if (form.values.idoffert !== "a" || form.values.idoffert !== "undefined") {
      navigate("/postulacion")
    } else
      alert(
        "No se pudo guardar el id de la oferta, por favor intentelo de nuevo"
      )
  }


  console.log(form.values.token)
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

