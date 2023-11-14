import React, { useEffect, useState } from "react"
import { useStoreon } from "storeon/react"
import { useQuill } from "react-quilljs"
import style from "./Postulacion.module.css"
import { Header } from "../../components/Header/Header"
import OfertaInfo from "../../components/ofertaInfo/OfertaInfo"
import Button from "../../components/Button/Button"
import { navigate } from "../../store"
import useApi from "../../Hooks/useApi"
import Popup from "../../components/Popup/Popup"
import { useTranslation } from "react-i18next"
import LanguageButton from "../../components/LanguageButton/LanguageButton"

const Postulacion = ({ id }) => {
  const { t } = useTranslation()
  const { user } = useStoreon("user")
  const api = useApi()
  const apiPostulation = useApi()

  const { quill, quillRef } = useQuill({
    readOnly: true, // Establecer el editor Quill en modo de solo lectura
    modules: {
      toolbar: false, // Ocultar la barra de herramientas
    },
  })
  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")

  const [detalles, setDetalles] = useState("")
  const [typeError, setTypeError] = useState(1)

  useEffect(() => {
    api.handleRequest("POST", "/offers/all", { id_oferta: id })
  }, [])

  useEffect(() => {
    if (api.data) {
      const { offer } = api.data
      setDetalles(offer.descripcion)
    }
  }, [api.data])

  useEffect(() => {
    if (quill && detalles) {
      try {
        quill.setContents(JSON.parse(detalles))
      } catch (error) {
        quill.setText(detalles)
      }
    }
  }, [quill, detalles])

  const handlePostularme = async () => {
    const apiResponse = await apiPostulation.handleRequest(
      "POST",
      "/postulations/",
      {
        id_oferta: parseInt(id, 10),
        id_estudiante: user.id_user,
        estado: "enviada",
      }
    )
    if (apiResponse.status === 200) {
      setTypeError(3)
      setError("Postulación enviada con éxito")
      setWarning(true)
      setTimeout(() => {
        navigate("/profile")
      }, 5000)
    } else {
      setTypeError(1)
      setError("Upss algo salió mal, intentalo de nuevo")
      setWarning(true)
    }
  }

  const handleRegresar = () => {
    navigate("/profile")
  }

  const parseTime = (isoString) => {
    const date = isoString.split("T")[1].split("Z")[0].slice(0, -3)
    const hours = parseInt(date.split(":")[0])
    if (hours > 12) {
      return `${hours - 12}:${date.split(":")[1]} P.M`
    } else if (hours === 12) {
      return `12:${date.split(":")[1]} P.M`
    } else if (hours === 0) {
      return `12:${date.split(":")[1]} A.M`
    } else {
      return `${hours}:${date.split(":")[1]} A.M`
    }
  }

  return (
    <div className={style.container}>
      <Popup
        message={error}
        status={warning}
        style={typeError}
        close={() => setWarning(false)}
      />
      {api.data ? (
        <div className={style.postulacionContainer}>
          <div className={style.titleContainer}>{api.data.offer.puesto}</div>
          <div className={style.dataContainer}>
            <OfertaInfo
              img="/images/empresa.svg"
              label={api.data.company.nombre}
            />
            <OfertaInfo
              img="/images/email.svg"
              label={api.data.company.correo}
            />
            <OfertaInfo
              img="/images/telefono.svg"
              label={api.data.company.telefono}
            />
            <OfertaInfo
              img="/images/requisitos.svg"
              label={api.data.offer.requisitos}
            />
            <OfertaInfo
              img="/images/salario.svg"
              label={api.data.offer.salario.toString()}
            />
            <OfertaInfo
              img="/images/jornada.svg"
              label={api.data.offer.jornada}
            />
            <OfertaInfo
              img="/images/horario.svg"
              label={`${parseTime(api.data.offer.hora_inicio)} - ${parseTime(
                api.data.offer.hora_fin
              )}`}
            />
          </div>
          <div className={style.label}>
            <span className={style.detailsText}>
              {t("offerPostulation.details")}
            </span>
            <div ref={quillRef} className={style.Editor} />
          </div>
          <div className={style.buttonContainer}>
            <Button
              label={t("offerPostulation.button1")}
              backgroundColor="#ccc"
              onClick={handleRegresar}
              noborder
            />
            <Button
              label={t("offerPostulation.button2")}
              backgroundColor="#a08ae5"
              onClick={() => {
                handlePostularme()
              }}
              noborder
            />
          </div>
        </div>
      ) : (
        <h1>Cargando...</h1>
      )}
      <div className={style.footer}>
        <LanguageButton />
      </div>
    </div>
  )
}

export default Postulacion
