import React, { useEffect, useState } from "react"
import Joi from "joi"
import useConfig from "../../Hooks/Useconfig"
import style from "./Postulacion.module.css"
import { Header } from "../../components/Header/Header"
import OfertaInfo from "../../components/ofertaInfo/OfertaInfo"
import Button from "../../components/Button/Button"
import { navigate } from "../../store"
import API_URL from "../../api"

const schema = Joi.object({
  token: Joi.string().required(),
  id_user: Joi.string().required(),
  idoffert: Joi.string().required(),
})

const Postulacion = () => {
  const form = useConfig(schema, {
    token: "a",
    idoffert: "a",
  })

  const [datosGet, setDataGet] = useState([])

  /* useEffect(() => {
    console.log("idoffertPrincipal", form.values.idoffert)
    console.log("token", form.values.token)
    console.log(datosGet)
  }, [form, datosGet]) */

  const configureData = async () => {
    const body = {
      id_oferta: form.values.idoffert,
    }

    const response = await fetch(`${API_URL}/api/offers`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${form.values.token}`,
      },
    })
    const datos = await response.json()
    setDataGet(datos)
  }

  useEffect(() => {
    configureData()
  }, [])

  const handleRegresar = () => {
    navigate("/profile")
  }
  const handlePostularme = () => {
    console.log("Postularme")
  }
  return (
    <div className={style.container}>
      <Header userperson="student" />
      <div className={style.postulacionContainer}>
        <div className={style.titleContainer}>
          {datosGet.length !== 0 ? datosGet.data.offer.puesto : "titulo"}
        </div>
        <div className={style.dataContainer}>
          <OfertaInfo
            img="images/empresa.svg"
            label={
              datosGet.length !== 0 ? datosGet.data.company.nombre : "Nombre"
            }
          />
          <OfertaInfo
            img="images/email.svg"
            label={
              datosGet.length !== 0 ? datosGet.data.company.correo : "Correo"
            }
          />
          <OfertaInfo
            img="images/telefono.svg"
            label={
              datosGet.length !== 0
                ? datosGet.data.company.telefono
                : "Telefono"
            }
          />
          <OfertaInfo
            img="images/requisitos.svg"
            label={
              datosGet.length !== 0
                ? datosGet.data.offer.requisitos
                : "Requisitos"
            }
          />
          <OfertaInfo
            img="images/salario.svg"
            label={
              datosGet.length !== 0 ? datosGet.data.offer.salrio : "Salario"
            }
          />
          <OfertaInfo
            img="images/descripcion.svg"
            label={
              datosGet.length !== 0
                ? datosGet.data.offer.descripcion
                : "Descripcion"
            }
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
    </div>
  )
}

export default Postulacion
