import React, { useEffect, useState } from "react"
import Select from "react-select"
import { useStoreon } from "storeon/react"
import { useQuill } from "react-quilljs"
import { ca } from "date-fns/locale"
import style from "./NewOffer.module.css"
import { Header } from "../../components/Header/Header"
import Button from "../../components/Button/Button"
import ComponentInput from "../../components/Input/Input"
import TextArea from "../../components/textAreaAutosize/TextAreaAuto"
import DropDown from "../../components/dropDown/DropDown"
import { navigate } from "../../store"
import useApi from "../../Hooks/useApi"
import "react-quill/dist/quill.snow.css"
import Popup from "../../components/Popup/Popup"

const Postulacion = () => {
  const { user } = useStoreon("user")
  const api = useApi()
  const apiCareers = useApi()

  const [requisitos, setRequisitos] = useState("")
  const [salario, setSalario] = useState("")
  const [jornada, setJornada] = useState("")
  const [horarioInicio, setHorarioInicio] = useState("")
  const [horarioFin, setHorarioFin] = useState("")
  const [puesto, setPuesto] = useState("")
  const [carrera, setCarrera] = useState("")
  const [carreras, setCarreras] = useState([])
  const { quill, quillRef } = useQuill()
  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")
  const [typePopUp, setTypePopUp] = useState(1)
  const formattedStartTime = `0000-01-01T${horarioInicio}:00Z`
  const formattedEndTime = `0000-01-01T${horarioFin}:00Z`

  const postOffer = async () => {
    if (
      puesto === "" ||
      salario === "" ||
      requisitos === "" ||
      carrera === ""
    ) {
      setTypePopUp(2)
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
        jornada,
        hora_inicio: formattedStartTime,
        hora_fin: formattedEndTime,
      })
      if (apiResponse.status === 200) {
        navigate("/postulacionempresa")
      } else {
        setTypePopUp(1)
        setError("Upss algo salió mal, intentalo de nuevo")
        setWarning(true)
      }
    }
  }

  const handleCarrera = (e) => {
    setCarrera(e.value)
  }

  const handleJornada = (e) => {
    setJornada(e.value)
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
      case "horarioinicio":
        setHorarioInicio(e.target.value)
        break
      case "horariofin":
        setHorarioFin(e.target.value)
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

  return (
    <div className={style.container}>
      <Header userperson="student" />
      <Popup
        message={error}
        status={warning}
        style={TypeError}
        close={() => setWarning(false)}
      />
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
            <span>Horario</span>
            <div className={style.horarioContainer}>
              <span className={style.horario}>Inicio (am)</span>
              <ComponentInput
                name="horarioinicio"
                type="time"
                onChange={handleInputsValue}
              />
              <span className={style.horario}>Fin (pm)</span>
              <ComponentInput
                name="horariofin"
                type="time"
                onChange={handleInputsValue}
              />
            </div>
          </div>
          <div className={style.inputContainer}>
            <span>Jornada</span>
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
              name="jornada"
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary25: "#94bd0f",
                  primary: "#a08ae5",
                },
              })}
              defaultValue={jornada}
              options={
                jornada === ""
                  ? [
                      { value: "Medio Tiempo", label: "Medio Tiempo" },
                      { value: "Tiempo Completo", label: "Tiempo Completo" },
                    ]
                  : [
                      { value: jornada, label: jornada },
                      { value: "Medio Tiempo", label: "Medio Tiempo" },
                      { value: "Tiempo Completo", label: "Tiempo Completo" },
                    ]
              }
              value={carreras.find((option) => option.label === carrera)}
              onChange={handleJornada}
            />
          </div>
          <div className={style.inputContainer}>
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
              value={carreras.find((option) => option.label === carrera)}
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
            backgroundColor="#ccc"
            onClick={handleRegresar}
            noborder
          />
          <Button
            label="Añadir"
            backgroundColor="#a08ae5"
            onClick={handlePostularme}
            noborder
          />
        </div>
      </div>
    </div>
  )
}

export default Postulacion
