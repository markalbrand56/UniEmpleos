import React, { useEffect, useState } from "react"
import useApi from "../../Hooks/useApi"
import Popup from "../../components/Popup/Popup"
import style from "./AdminShowPostulationDetails.module.css"
import Loader from "../../components/Loader/Loader"
import OfertaInfo from "../../components/ofertaInfo/OfertaInfo"
import { useQuill } from "react-quilljs"
import Button from "../../components/Button/Button"
import { navigate } from "../../store"

const AdminShowPostulationDetails = ({ id }) => {
  const postulationDetails = useApi()
  const api = useApi()
  const [data, setData] = useState(null)
  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")
  const [typeError, setTypeError] = useState(1)
  const [loading, setLoading] = useState(false)
  const { quill, quillRef } = useQuill({
    readOnly: true, // Establecer el editor Quill en modo de solo lectura
    modules: {
      toolbar: false, // Ocultar la barra de herramientas
    },
  })
  const [detalles, setDetalles] = useState("")

  const getPostulationsDetails = async () => {
    setLoading(true)
    const datos = await postulationDetails.handleRequest(
      "POST",
      "/offers/all",
      {
        id_oferta: id,
      }
    )

    if (datos.status === 200) {
      setData(datos.data)
    } else {
      setTypeError(1)
      setError("Ups, algo salio mal al obtener la oferta")
      setWarning(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    getPostulationsDetails()
  }, [])

  useEffect(() => {
    if (data) {
      const { offer } = data
      setDetalles(offer.descripcion)
    }
  }, [data])

  useEffect(() => {
    if (quill && detalles) {
      try {
        quill.setContents(JSON.parse(detalles))
      } catch (error) {
        quill.setText(detalles)
      }
    }
  }, [quill, detalles])

  const onclickAccept = async (e) => {
    const variableApi = `/admins/delete/offers?id_oferta=${id}`
    const apiResponse = await api.handleRequest("DELETE", variableApi)
    if (apiResponse.status === 200) {
      setTypeError(3)
      setError("Oferta eliminada con éxito")
      setWarning(true)
      setTimeout(() => {
        navigate(`/publicProfileAdminEnterprise/${e}`)
      }, 5000)
    } else {
      setTypeError(1)
      setError("Upss algo salió mal, intentalo de nuevo")
      setWarning(true)
    }
  }

  const handleReturn = (e) => {
    navigate(`/publicProfileAdminEnterprise/${e}`)
  }

  return (
    <div className={style.container}>
      <Popup
        message={error}
        status={warning}
        style={typeError}
        close={() => setWarning(false)}
      />
      {data && !loading ? (
        <div className={style.postulacionContainer}>
          <div className={style.headertittlecontainer}>
            <div className={style.titleContainer}>
              <h4>{data.offer.puesto}</h4>
              <button
                onClick={() => {
                  onclickAccept(data.company.correo)
                }}
                type="button"
                className={style.deleteButton}
              >
                <img src="/images/delete.svg" alt="trash" />
              </button>
            </div>
          </div>
          <div className={style.dataContainer}>
            <OfertaInfo img="/images/empresa.svg" label={data.company.nombre} />
            <OfertaInfo img="/images/email.svg" label={data.company.correo} />
            <OfertaInfo
              img="/images/telefono.svg"
              label={data.company.telefono}
            />
            <OfertaInfo
              img="/images/requisitos.svg"
              label={data.offer.requisitos}
            />
            <OfertaInfo
              img="/images/salario.svg"
              label={data.offer.salario.toString()}
            />
          </div>
          <div className={style.label}>
            Detalles
            <div ref={quillRef} className={style.Editor} />
          </div>
          <div className={style.buttonContainer}>
            <Button
              label="Regresar"
              backgroundColor="#94bd0f"
              onClick={() => {
                handleReturn(data.company.correo)
              }}
            />
          </div>
        </div>
      ) : (
        <div className={style.loaderContainer}>
          <Loader size={100} />
        </div>
      )}
    </div>
  )
}

export default AdminShowPostulationDetails
