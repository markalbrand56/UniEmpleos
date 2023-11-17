/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react"
import { BiArrowBack, BiUser } from "react-icons/bi"
import { BsPhone } from "react-icons/bs"
import { PiBooksLight } from "react-icons/pi"
import { LiaUniversitySolid, LiaBirthdayCakeSolid } from "react-icons/lia"
import { AiTwotoneCalendar } from "react-icons/ai"
import { HiOutlineMailOpen, HiOutlineDocumentDownload } from "react-icons/hi"
import { useTranslation } from "react-i18next"
import useApi from "../../Hooks/useApi"
import Popup from "../../components/Popup/Popup"
import { navigate } from "../../store"
import style from "./PublicProfile.module.css"
import API_URL from "../../api"
import Loader from "../../components/Loader/Loader"

const PublicProfile = ({ params }) => {
  const { t } = useTranslation()
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
  const [loading, setLoading] = useState(false)

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
    setLoading(true)
    const datos = await api.handleRequest("POST", "/users/details", {
      correo,
    })
    if (datos.status === 200) {
      if (datos.data.student) {
        setUsuario(datos.data.student)
      } else {
        setUsuario(datos.data.company)
      }
      setLoading(false)
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
      {loading ? (
        <Loader size={100} />
      ) : (
        <div className={style.infoContainer}>
          <h1 className={style.title}>
            {usuario.nombre} {usuario.apellido}
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
                <HiOutlineMailOpen size={30} />
                <span className={style.correo}>
                  {t("signUpStudent.page.email")}: {usuario.correo}
                </span>
              </div>
              <div className={style.profileli}>
                <BsPhone size={30} />
                <span className={style.profileSpan}>
                  {t("signUpStudent.page.phone")}: {usuario.telefono}
                </span>
              </div>
              {usuario.universidad && (
                <div className={style.profileli}>
                  <LiaUniversitySolid size={30} />
                  <span className={style.profileSpan}>
                    {t("signUpStudent.page.university")}: {usuario.universidad}
                  </span>
                </div>
              )}
              {usuario.carrera && (
                <div className={style.profileli}>
                  <PiBooksLight size={30} />
                  <span className={style.profileSpan}>
                    {t("signUpStudent.page.career")}: {carrera}
                  </span>
                </div>
              )}
              {usuario.nacimiento && (
                <div className={style.profileli}>
                  <LiaBirthdayCakeSolid size={30} />
                  <span className={style.profileSpan}>
                    {t("signUpStudent.page.age")}: {edad}
                  </span>
                </div>
              )}
              {usuario.semestre && (
                <div className={style.profileli}>
                  <AiTwotoneCalendar size={30} />
                  <span className={style.profileSpan}>
                    {t("signUpStudent.page.semester")}: {usuario.semestre}
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
      )}
    </div>
  )
}

export default PublicProfile
