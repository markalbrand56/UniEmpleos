/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react"
import { BiArrowBack, BiUser } from "react-icons/bi"
import { BsPhone } from "react-icons/bs"
import { PiBooksLight } from "react-icons/pi"
import { LiaUniversitySolid, LiaBirthdayCakeSolid } from "react-icons/lia"
import { AiTwotoneCalendar } from "react-icons/ai"
import { HiOutlineMailOpen } from "react-icons/hi"
import useApi from "../../hooks/useApi"
import Popup from "../../components/Popup/Popup"
import { navigate } from "../../store"
import style from "./PublicProfile.module.css"

const PublicProfile = ({ correo }) => {
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
        navigate("/postulacionempresa")
      }, 5000)
    }
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
          top: "10px",
          left: "20px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/postulacionempresa")}
      />
      {usuario ? (
        <div className={style.infoContainer}>
          {usuario.foto && (
            <div className={style.pfpContainer}>
              <img
                className={style.pfp}
                src={usuario.foto}
                alt={`${usuario.nombre} ${usuario.apellido}`}
              />
            </div>
          )}
          <div className={style.subInfoContainer}>
            <div className={style.nombreContainer}>
              <BiUser size={30} />
              <span className={style.nombre}>
                Nombre: {`${usuario.nombre} ${usuario.apellido}`}
              </span>
            </div>

            <div className={style.emailContainer}>
              <HiOutlineMailOpen size={30} />
              <span className={style.email}>Correo: {usuario.correo}</span>
            </div>
            <div className={style.telefonoContainer}>
              <BsPhone size={30} />
              <span className={style.telefono}>
                Telefono: {usuario.telefono}
              </span>
            </div>
            {usuario.universidad && (
              <div className={style.universityContainer}>
                <LiaUniversitySolid size={30} />
                <span className={style.university}>
                  Universidad: {usuario.universidad}
                </span>
              </div>
            )}
            {usuario.carrera && (
              <div className={style.carreraContainer}>
                <PiBooksLight size={30} />
                <span className={style.carrera}>Carrera: {carrera}</span>
              </div>
            )}
            {usuario.nacimiento && (
              <div className={style.edadContainer}>
                <LiaBirthdayCakeSolid size={30} />
                <span className={style.edad}>Edad: {edad}</span>
              </div>
            )}
            {usuario.semestre && (
              <div className={style.semestreContainer}>
                <AiTwotoneCalendar size={30} />
                <span className={style.semestre}>
                  Semestre: {usuario.semestre}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>Cargando</div>
      )}
    </div>
  )
}

export default PublicProfile
