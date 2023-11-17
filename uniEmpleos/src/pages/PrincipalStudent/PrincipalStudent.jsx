import React, { useEffect, useState } from "react"
import Joi from "joi"
import styles from "./PrincipalStudent.module.css"
import InfoTab from "../../components/InfoTab/InfoTab"
import { navigate } from "../../store"
import { Header } from "../../components/Header/Header"
import useConfig from "../../Hooks/Useconfig"
import API_URL from "../../api"
import useApi from "../../Hooks/useApi"
import Loader from "../../components/Loader/Loader"
import { useTranslation } from "react-i18next"
import { Player } from '@lottiefiles/react-lottie-player'
import upload from './upload.json'

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
  const [ofertasAMostrar, setOfertasAMostrar] = useState([])
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const form = useConfig(schema, {
    token: "a",
    idoffert: "a",
    id_user: "a",
  })

  const [dataa, setData] = useState([])

  const configureData = async () => {
    setLoading(true)
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
      const postArray = []
      for (const i in apiPostulations.data.postulations) {
        postArray.push(apiPostulations.data.postulations[i].id_oferta)
      }
      setPostulaciones(postArray)
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

  const handleOfertasAMostrar = () => {
    const ofertas = []
    dataa.data.postulations.map((postulation) => {
      const regex = new RegExp(carrera)
      if (
        regex.test(postulation.nombre_carrera) &&
        carrera !== "" &&
        postulaciones &&
        !postulaciones.includes(postulation.id_oferta)
      ) {
        ofertas.push(postulation)
      }
    })
    setOfertasAMostrar(ofertas)
    setLoading(false)
  }

  useEffect(() => {
    if (dataa.status === 200) {
      handleOfertasAMostrar()
    }
  }, [dataa.data, carrera, postulaciones])

  return (
    <div className={styles.container}>
      <Header userperson="student" />
      {loading ? (
        <div className={styles.loaderContainer}><Loader size={100} /></div>
      ) : dataa.status === 200 && ofertasAMostrar.length > 0 ? (
        <div className={styles.containerinfomain}>
          {ofertasAMostrar.map((postulation) => (
            <InfoTab
              key={postulation.id_oferta}
              title={postulation.puesto}
              salary={`Q.${postulation.salario}.00`}
              company={postulation.nombre_empresa}
              jornada={postulation.jornada}
              horarioinicio={postulation.hora_inicio}
              horariofin={postulation.hora_fin}
              labelbutton={t("previewOffer.apply")}
              onClick={() => saveidlocalstorage(postulation.id_oferta)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.containerinfomain}>
          <h1 style={{color: "#000"}}>No hay postulaciones</h1>
          <Player
          src={upload}
          className="player"
          loop
          autoplay
          style={{ height: '400px', width: '400px' }}
        />
        </div>
      )}
    </div>
  )
}

export default PrincipalStudent
