/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react"
import { BiArrowBack, BiUser } from "react-icons/bi"
import { BsPhone } from "react-icons/bs"
import { PiBooksLight } from "react-icons/pi"
import { LiaUniversitySolid, LiaBirthdayCakeSolid } from "react-icons/lia"
import { AiTwotoneCalendar } from "react-icons/ai"
import { HiOutlineMailOpen, HiOutlineDocumentDownload } from "react-icons/hi"
import { LuFileSpreadsheet } from "react-icons/lu"
import useApi from "../../Hooks/useApi"
import Popup from "../../components/Popup/Popup"
import { navigate } from "../../store"
import style from "./PublicProfile.module.css"
import API_URL from "../../api"

const PublicProfile = ({ params }) => {
  const correo = params.split("-")[0]
  const idOferta = params.split("-")[1]
  const api = useApi()
  const carreraApi = useApi()
  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")
  const [typeError, setTypeError] = useState(1)
  const [usuario, setUsuario] = useState([])
  const [carrera, setCarrera] = useState("")
  const [edad, setEdad] = useState("")

  const obtenerCarrera = async () => {
    const datos = await carreraApi.handleRequest("GET", "/careers")
    if (datos.status === 200 && usuario.carrera) {
      for (let i = 0; i < datos.data.careers.length; i += 1) {
        if (datos.data.careers[i].id_carrera === usuario.carrera) {
          setCarrera(datos.data.careers[i].nombre)
        }
      }
    }
  }

  const calcularEdad = () => {
    const fechaNacimientoObj = new Date(usuario.nacimiento)
    const fechaActual = new Date()
    const diferencia = fechaActual - fechaNacimientoObj
    const edadActual = Math.floor(diferencia / (365.25 * 24 * 60 * 60 * 1000))
    setEdad(edadActual)
  }

  console.log("-->", usuario)
  const obtenerPostulante = async () => {
    const datos = await api.handleRequest("POST", "/users/details", {
      correo,
    })
    if (datos.status === 200) {
      if (datos.data.student) {
        setUsuario(datos.data.student)
      } else {
        setUsuario(datos.data.company)
      }
    } else {
      setTypeError(1)
      setError("Ups, algo salio mal al obtener el perfil")
      setWarning(true)
      setTimeout(() => {
        navigate(`/postulantes/${idOferta}`)
      }, 5000)
    }
  }

  const showCV = (cv) => {
    window.open(`${API_URL}/api/cv/${cv}`)
  }

  useEffect(() => {
    obtenerPostulante()
  }, [])

  useEffect(() => {
    if (usuario) {
      obtenerCarrera()
      calcularEdad()
    }
  }, [usuario])

  return (
    <div className={style.mainContainer}>
      <Popup
        message={error}
        status={warning}
        style={typeError}
        close={() => setWarning(false)}
      />
      <BiArrowBack
        size={30}
        style={{
          color: "#000",
          position: "absolute",
          top: "40px",
          left: "20px",
          cursor: "pointer",
        }}
        onClick={() => navigate(`/postulantes/${idOferta}`)}
      />
      {usuario ? (
        <div className={style.infoContainer}>
          <h1 className={style.title}>
            Perfil de {usuario.nombre} {usuario.apellido}
          </h1>
          <div className={style.tipoContainer}>
            {usuario.foto && (
              <div className={style.pfpContainer}>
                <img
                  className={style.pfp}
                  src={`${API_URL}/api/uploads/${usuario.foto}`}
                  alt={`${usuario.nombre} ${usuario.apellido}`}
                />
              </div>
            )}
            <div className={style.subInfoContainer}>
              <div className={style.profileli}>
                <BiUser size={30} />
                <span className={style.profileSpan}>
                  Nombre: {`${usuario.nombre} ${usuario.apellido}`}
                </span>
              </div>
              <div className={style.profileli}>
                <HiOutlineMailOpen size={30} />
                <span className={style.correo}>Correo: {usuario.correo}</span>
              </div>
              <div className={style.profileli}>
                <BsPhone size={30} />
                <span className={style.profileSpan}>
                  Telefono: {usuario.telefono}
                </span>
              </div>
              {usuario.universidad && (
                <div className={style.profileli}>
                  <LiaUniversitySolid size={30} />
                  <span className={style.profileSpan}>
                    Universidad: {usuario.universidad}
                  </span>
                </div>
              )}
              {usuario.carrera && (
                <div className={style.profileli}>
                  <PiBooksLight size={30} />
                  <span className={style.profileSpan}>Carrera: {carrera}</span>
                </div>
              )}
              {usuario.nacimiento && (
                <div className={style.profileli}>
                  <LiaBirthdayCakeSolid size={30} />
                  <span className={style.profileSpan}>Edad: {edad}</span>
                </div>
              )}
              {usuario.semestre && (
                <div className={style.profileli}>
                  <AiTwotoneCalendar size={30} />
                  <span className={style.profileSpan}>
                    Semestre: {usuario.semestre}
                  </span>
                </div>
              )}
              {usuario.cv && (
                <div className={style.profileli}>
                  <HiOutlineDocumentDownload
                    size={30}
                    onClick={() => showCV(usuario.cv)}
                    style={{ cursor: "pointer" }}
                  />
                  <span className={style.profileSpan}>CV</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>Cargando</div>
      )}
    </div>
  )
}

export default PublicProfile
