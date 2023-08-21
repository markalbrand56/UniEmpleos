import React, { useEffect, useState } from "react"
import { useStoreon } from "storeon/react"
import style from "./NewOffer.module.css"
import { Header } from "../../components/Header/Header"
import Button from "../../components/Button/Button"
import ComponentInput from "../../components/Input/Input"
import TextArea from "../../components/textAreaAutosize/TextAreaAuto"
import DropDown from "../../components/dropDown/DropDown"
import { navigate } from "../../store"
import useApi from "../../Hooks/useApi"
import { useQuill } from "react-quilljs"
import Popup from "../../components/Popup/Popup"

const Postulacion = () => {
  const { user } = useStoreon("user")
  const api = useApi()
  const apiCareers = useApi()

  const [requisitos, setRequisitos] = useState("")
  const [salario, setSalario] = useState("")
  const [puesto, setPuesto] = useState("")
  const [carrera, setCarrera] = useState("")
  const [carreras, setCarreras] = useState([])
  const { quill, quillRef } = useQuill()
  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")

  const postOffer = async () => {
    if (
      puesto === "" ||
      salario === "" ||
      requisitos === "" ||
      carrera === ""
    ) {
      setError("Solamente el campo de descripción puede estar vacío")
      setWarning(true)
    } else {
      const details = JSON.stringify(quill.getContents())
      const apiResponse = await api.handleRequest("POST", "/offers/", {
        id_empresa: user.id_user,
        puesto,
        salario: parseFloat(salario),
        descripcion: details,
        requisitos,
        id_carreras: [carrera],
      })
      if (apiResponse.status === 200) {
        navigate("/postulacionempresa")
      } else {
        setError("Upss algo salió mal, intentalo de nuevo")
        setWarning(true)
      }
    }
  }

  const handleCarrera = (e) => {
    setCarrera(e.target.value)
  }

  const handleInputsValue = (e) => {
    switch (e.target.name) {
      case "salario":
        setSalario(e.target.value.toString())
        break
      case "requisitos":
        setRequisitos(e.target.value)
        break
      case "puesto":
        setPuesto(e.target.value)
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (apiCareers.data) {
      const { careers } = apiCareers.data
      const dataCarreras = careers.map((e) => ({
        value: e.id_carrera.toString(),
        label: e.nombre,
      }))
      setCarreras(dataCarreras)
    }
  }, [apiCareers.data])

  useEffect(() => {
    api.handleRequest("GET", "/users/")
    apiCareers.handleRequest("GET", "/careers")
  }, [])

  const handleRegresar = () => {
    navigate("/profilecompany")
  }
  const handlePostularme = () => {
    postOffer()
  }

  const handelPopupStatus = () => {
    setWarning(false)
  }

  return (
    <div className={style.container}>
      <Header userperson="student" />
      <Popup status={warning} message={error} closePopup={handelPopupStatus} />
      <div className={style.postulacionContainer}>
        <div className={style.titleContainer}>Nueva oferta laboral</div>
        <div className={style.dataContainer}>
          <div className={style.inputContainer}>
            <span>Puesto</span>
            <ComponentInput
              name="puesto"
              type="text"
              placeholder="Frontend Developer"
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputContainer}>
            <span>Salario</span>
            <ComponentInput
              name="salario"
              type="number"
              placeholder="Q5000.00"
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputContainer}>
            <span>Carrera</span>
            <DropDown
              opciones={carreras}
              value={carrera}
              onChange={handleCarrera}
            />
          </div>
          <div className={style.inputContainer}>
            <span>Requisitos</span>
            <TextArea
              name="requisitos"
              type="text"
              placeholder="Requisitos para el puesto..."
              onChange={handleInputsValue}
              min={1}
              max={5}
            />
          </div>
          <div className={style.inputContainer}>
            <span>Descripción</span>
            <div ref={quillRef} />
          </div>
        </div>
        <div className={style.buttonContainer}>
          <Button
            label="Regresar"
            backgroundColor="transparet"
            onClick={handleRegresar}
          />
          <Button
            label="Añadir"
            backgroundColor="#a08ae5"
            onClick={handlePostularme}
          />
        </div>
      </div>
    </div>
  )
}

export default Postulacion
