import React, { useEffect, useState } from "react"
import { useStoreon } from "storeon/react"
import Joi from "joi"
import { useQuill } from "react-quilljs"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import styles from "./OfferDetails.module.css"
import { Header } from "../../components/Header/Header"
import Button from "../../components/Button/Button"
import ComponentInput from "../../components/Input/Input"
import TextArea from "../../components/textAreaAutosize/TextAreaAuto"
import DropDown from "../../components/dropDown/DropDown"
import { navigate } from "../../store"
import useApi from "../../Hooks/useApi"
import "react-quill/dist/quill.snow.css"
import useConfig from "../../Hooks/Useconfig"
import Popup from "../../components/Popup/Popup"

const animatedComponents = makeAnimated()

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
  const [carrera, setCarrera] = useState([])
  const [carreras, setCarreras] = useState([])
  const { quill, quillRef } = useQuill()
  const [warning, setWarning] = useState(false)
  const [typePopUp, setTypePopUp] = useState(1)
  const [error, setError] = useState("")

  useEffect(() => {
    apiCareers.handleRequest("GET", "/careers")
    api.handleRequest("POST", "/offers/company", {
      id_empresa: user.id_user,
    })
  }, [])

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
    if (api.data) {
      const dataa = api.data.offers
      for (let i = 0; i < dataa.length; i++) {
        if (dataa[i].id_oferta === parseInt(id, 10)) {
          console.log("changing", dataa[i])
          setPuesto(dataa[i].puesto)
          setSalario(dataa[i].salario)
          setRequisitos(dataa[i].requisitos)
          setDetalles(dataa[i].descripcion)
          if (dataa[i].id_carreras !== null) {
            setCarrera(dataa[i].id_carreras.map((num) => num.toString()))
          } else {
            setCarrera(["1"])
          }
        } else {
          console.log("not changing", id)
        }
      }
    }
  }, [api.data])

  const updateOffer = async () => {
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
      const apiResponse = await api.handleRequest("PUT", "/offers/", {
        id_oferta: parseInt(id, 10),
        puesto,
        descripcion: details,
        requisitos,
        salario: parseFloat(salario),
        id_carreras: carrera,
      })
      if (apiResponse.status === 200) {
        navigate("/postulacionempresa")
      } else {
        setError("Upss algo salió mal, intentalo de nuevo")
        setWarning(true)
      }
    }
  }

  useEffect(() => {
    if (quill && detalles) {
      try {
        quill.setContents(JSON.parse(detalles))
      } catch (error) {
        console.log("Error al cargar detalles", error)
      }
    }
  }, [quill, detalles])

  const handleRegresar = () => {
    navigate("/postulacionempresa")
  }

  const handleTypeSelect = (e) => {
    setCarrera(e.map((obj) => obj.value))
    console.log(e.map((obj) => obj.value))
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

  const succcessJobOffer = () => {
    setTimeout(() => {
      navigate("/postulacionempresa")
    }, 4000)
  }

  const onclickAccept = async () => {
    const variableApi = `/offers/?id_oferta=${id}`
    const apiResponse = await api.handleRequest("DELETE", variableApi)
    if (apiResponse.status === 200) {
      setWarning(true)
      setError("Oferta eliminada con éxito")
      setTypePopUp(3)
      succcessJobOffer()
    } else {
      setWarning(true)
      setTypePopUp(1)
      setError("Upss algo salió mal, intentalo de nuevo")
      setWarning(true)
    }
  }

  return (
    <div className={styles.container}>
      <Popup
        message={error}
        status={warning}
        style={typePopUp}
        close={() => setWarning(false)}
      />
      <Header userperson="enterprise" />
      <div className={styles.postulacionContainer}>
        <div className={styles.headertittlecontainer}>
          <div className={styles.titleContainer}>
            <h4>Detalles de la oferta</h4>
            <button onClick={onclickAccept} type="button">
              <img src="/images/delete.svg" alt="trash" />
            </button>
          </div>
        </div>

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
            <Select
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused ? "#a08ae5" : "grey",
                  color: "black",
                }),
                option: (baseStyles) => ({
                  ...baseStyles,
                  color: "black",
                }),
              }}
              name="carrera"
              isMulti
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary25: "#94bd0f",
                  primary: "#a08ae5",
                },
              })}
              defaultValue={carrera}
              options={carreras}
              formatGroupLabel={carreras}
              components={animatedComponents}
              value={carreras.filter(
                (obj) => carrera && carrera.includes(obj.value)
              )}
              onChange={handleTypeSelect}
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
