import React, { useEffect, useState } from "react"
import { useStoreon } from "storeon/react"
import style from "./Postulacion.module.css"
import { Header } from "../../components/Header/Header"
import OfertaInfo from "../../components/ofertaInfo/OfertaInfo"
import Button from "../../components/Button/Button"
import { navigate } from "../../store"
import useApi from "../../Hooks/useApi"
import { useQuill } from "react-quilljs"

const Postulacion = ({ id }) => {
  const { user } = useStoreon("user")
  const api = useApi()
  const { quill, quillRef } = useQuill({
    readOnly: true, // Establecer el editor Quill en modo de solo lectura
    modules: {
      toolbar: false, // Ocultar la barra de herramientas
    },
  })

  const [detalles, setDetalles] = useState("")

  useEffect(() => {
    api.handleRequest("POST", "/offers/all", { id_oferta: id })
  }, [])

  useEffect(() => {
    if (api.data) {
      const { offer } = api.data
      console.log("offer", offer)
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

  const handlePostularme = () => {
    api.handleRequest("POST", "/postulations/", {
      id_oferta: parseInt(id, 10),
      id_estudiante: user.id_user,
      estado: "enviada",
    })
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
          </div>
          <div className={style.label}>
            Detalles
            <div ref={quillRef} />
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
