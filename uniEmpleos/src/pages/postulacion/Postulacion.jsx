import React, { useEffect, useState } from "react"
import style from "./Postulacion.module.css"
import { Header } from "../../components/Header/Header"
import OfertaInfo from "../../components/ofertaInfo/OfertaInfo"
import Button from "../../components/Button/Button"
import { navigate } from "../../store"
import API_URL from "../../api"

const Postulacion = () => {
  const [dataa, setData] = useState([])

  const body = {
    id_oferta: "1",
  }

  const configureData = async () => {
    const response = await fetch(`${API_URL}/api/offers`, {
      method: "GET",
      body: JSON.stringify(body),
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
        <div className={style.titleContainer}>Titulo</div>
        <div className={style.dataContainer}>
          <OfertaInfo img="images/empresa.svg" label="Nombre de la Empresa" />
          <OfertaInfo img="images/email.svg" label="Correo" />
          <OfertaInfo img="images/telefono.svg" label="Telefono" />
          <OfertaInfo img="images/requisitos.svg" label="Requisitos" />
          <OfertaInfo img="images/salario.svg" label="Salario" />
          <OfertaInfo img="images/descripcion.svg" label="Descripcion" />
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
