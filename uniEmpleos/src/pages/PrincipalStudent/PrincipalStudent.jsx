import React, { useEffect, useState } from "react"
import Joi from "joi"
import styles from "./PrincipalStudent.module.css"
import InfoTab from "../../components/InfoTab/InfoTab"
import { navigate } from "../../store"
import { Header } from "../../components/Header/Header"
import useConfig from "../../Hooks/Useconfig"
import API_URL from "../../api"
import useApi from "../../Hooks/useApi"

const schema = Joi.object({
  token: Joi.string().required(),
  idoffert: Joi.string().required(),
  id_user: Joi.string().required(),
})

const PrincipalStudent = () => {
  const api = useApi()
  const apiCareers = useApi()
  const apiPostulations = useApi()
  const [carrera, setCarrera] = useState("")
  const [postulaciones, setPostulaciones] = useState([])

  const form = useConfig(schema, {
    token: "a",
    idoffert: "a",
    id_user: "a",
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
    setData(datos)
  }

  useEffect(() => {
    if (api.data && apiCareers.data) {
      const carreraID = api.data.usuario.carrera
      for (const i of apiCareers.data.careers) {
        if (i.id_carrera === carreraID) {
          setCarrera(i.nombre)
        }
      }
    }
  }, [api.data, apiCareers.data])

  useEffect(() => {
    configureData()
    api.handleRequest("GET", "/users/")
    apiCareers.handleRequest("GET", "/careers")
    apiPostulations.handleRequest("GET", "/postulations/getFromStudent")
  }, [])

  useEffect(() => {
    if (apiPostulations.data) {
      setPostulaciones(apiPostulations.data)
    }
  }, [apiPostulations.data])

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
          {dataa.data.postulations.map((postulation) => {
            const regex = new RegExp(carrera)
            if (
              regex.test(postulation.nombre_carreras) &&
              carrera !== "" &&
              postulaciones.id_oferta &&
              !(postulation.id_oferta in postulaciones.id_oferta)
            ) {
              return (
                <InfoTab
                  key={postulation.id_oferta}
                  title={postulation.puesto}
                  salary={`Q.${postulation.salario}.00`}
                  company={postulation.nombre_empresa}
                  labelbutton="Postularme"
                  onClick={() => saveidlocalstorage(postulation.id_oferta)}
                />
              )
            }
          })}
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
