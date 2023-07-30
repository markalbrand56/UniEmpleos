import React, { useEffect, useState } from "react"
import { useStoreon } from "storeon/react"
import Joi from "joi"
import styles from "./OfferDetails.module.css"
import { Header } from "../../components/Header/Header"
import Button from "../../components/Button/Button"
import ComponentInput from "../../components/Input/Input"
import TextArea from "../../components/textAreaAutosize/TextAreaAuto"
import DropDown from "../../components/dropDown/DropDown"
import { navigate } from "../../store"
import useApi from "../../Hooks/useApi"
import { useQuill } from "react-quilljs"
import MyEditor from "../../components/textEditor/textEditor"
import useConfig from "../../Hooks/Useconfig"

const schema = Joi.object({
  token: Joi.string().required(),
  idoffert: Joi.string().required(),
  id_user: Joi.string().required(),
})

const OfferDetails = ({ id }) => {
  const { user } = useStoreon("user")
  const api = useApi()
  const apiCareers = useApi()

  const [requisitos, setRequisitos] = useState("")
  const [salario, setSalario] = useState("")
  const [puesto, setPuesto] = useState("")
  const [detalles, setDetalles] = useState("")
  const [carrera, setCarrera] = useState("1")
  const [carreras, setCarreras] = useState([])
  const { quill, quillRef } = useQuill()

  const handleCarrera = (e) => {
    setCarrera(e.target.value)
  }

  const handleInputsValue = (e) => {
    switch (e.target.name) {
      case "salario":
        setSalario(e.target.value.toString())
        break
      case "detalles":
        setDetalles(e.target.value)
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
    navigate("/postulacionempresa")
  }

  const [dataa, setData] = useState([])

  useEffect(() => {
    if (api.data) {
      const { offers } = api.data
      setData(offers)
    }
    if (dataa) {
      for (let i = 0; i < dataa.length; i++) {
        if (dataa[i].id_oferta === parseInt(id, 10)) {
          setPuesto(dataa[i].puesto)
          setSalario(dataa[i].salario)
          setRequisitos(dataa[i].requisitos)
          setDetalles(dataa[i].detalles)
          setCarrera(dataa[i].id_carrera)
        } else {
          console.log("not changing", id)
        }
      }
    }
  }, [api.data])

  useEffect(() => {
    api.handleRequest("POST", "/offers/company", {
      id_empresa: user.id_user,
    })
  }, [])

  const updateOffer = () => {
    const details = JSON.stringify(quill.getContents())   
    api.handleRequest("PUT", "/offers/", {
      id_oferta: parseInt(id, 10),
      puesto,
      descripcion: details,
      requisitos,
      salario: parseFloat(salario),
      id_carrera: carrera ?? "1",
    })
    navigate("/postulacionempresa")
  }

  useEffect(() => {
    if (quill) {
      try {
        quill.setContents(JSON.parse(detalles))
      } catch (error) {
        console.log("Error al cargar detalles", error, detalles)
      }
    }
  }, [quill])


  

  return (
    <div className={styles.container}>
      <Header userperson="student" />
      <div className={styles.postulacionContainer}>
        <div className={styles.titleContainer}>Detalles de la oferta</div>
        <div className={styles.dataContainer}>
          <div className={styles.inputContainer}>
            <span>Puesto</span>
            <ComponentInput
              name="puesto"
              type="text"
              placeholder="Frontend Developer"
              onChange={handleInputsValue}
              value={puesto}
            />
          </div>
          <div className={styles.inputContainer}>
            <span>Salario</span>
            <ComponentInput
              name="salario"
              type="number"
              placeholder="Q5000.00"
              onChange={handleInputsValue}
              value={salario}
            />
          </div>
          <div className={styles.inputContainer}>
            <span>Carrera</span>
            <DropDown
              opciones={carreras}
              value={carrera}
              onChange={handleCarrera}
            />
          </div>
          <div className={styles.inputContainer}>
            <span>Requisitos</span>
            <TextArea
              name="requisitos"
              type="text"
              placeholder="Requisitos para el puesto..."
              onChange={handleInputsValue}
              min={1}
              max={5}
              value={requisitos}
            />
          </div>
          <div className={styles.inputContainer}>
            <span>Descripción</span>
            <div ref={quillRef} />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            label="Regresar"
            backgroundColor="transparet"
            onClick={handleRegresar}
          />
          <Button
            label="Guardar"
            backgroundColor="#a08ae5"
            onClick={updateOffer}
          />
        </div>
      </div>
    </div>
  )
}

export default OfferDetails
