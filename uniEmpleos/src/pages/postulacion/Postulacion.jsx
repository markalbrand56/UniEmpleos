import React, { useEffect, useState } from "react"
import { useStoreon } from "storeon/react"
import style from "./Postulacion.module.css"
import { Header } from "../../components/Header/Header"
import OfertaInfo from "../../components/ofertaInfo/OfertaInfo"
import Button from "../../components/Button/Button"
import { navigate } from "../../store"
import useApi from "../../Hooks/useApi"

const Postulacion = ({ id }) => {
  const { user } = useStoreon("user")
  const api = useApi()

  useEffect(() => {
    api.handleRequest("POST", "/offers/all", { id_oferta: id })
  }, [])

  const body = {
    id_estudiante: user.id,
    id_oferta: id,
    estado: "enviada",
  }
  const handlePostularme = () => {
    api.handleRequest("POST", "/postulacion", body)
    navigate("/profile")
  }

  const handleRegresar = () => {
    navigate("/profile")
  }
  return (
    <div className={style.container}>
      <Header userperson="student" />
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
              img="/images/descripcion.svg"
              label={api.data.offer.descripcion}
            />
          </div>
          <div className={style.buttonContainer}>
            <Button
              label="Regresar"
              backgroundColor="transparet"
              onClick={handleRegresar}
            />
            <Button
              label="Postularme"
              backgroundColor="#a08ae5"
              onClick={handlePostularme}
            />
          </div>
        </div>
      ) : (
        <h1>Cargando...</h1>
      )}
    </div>
  )
}

export default Postulacion
