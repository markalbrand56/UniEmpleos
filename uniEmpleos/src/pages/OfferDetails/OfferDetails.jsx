import React, { useEffect, useState } from "react"
import Select from "react-select"
import { useStoreon } from "storeon/react"
import Joi from "joi"
import { useQuill } from "react-quilljs"
import { format } from "date-fns"
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
  const [jornada, setJornada] = useState("")
  // Estados para la visualización
  const [horarioInicioDisplay, setHorarioInicioDisplay] = useState("")
  const [horarioFinDisplay, setHorarioFinDisplay] = useState("")

  // Estados para la actualización (mantienen el valor completo ISO)
  const [horarioInicioUpdate, setHorarioInicioUpdate] = useState("")
  const [horarioFinUpdate, setHorarioFinUpdate] = useState("")
  const [puesto, setPuesto] = useState("")
  const [detalles, setDetalles] = useState("")
  const [carrera, setCarrera] = useState("")
  const [carreras, setCarreras] = useState([])
  const { quill, quillRef } = useQuill()
  const [warning, setWarning] = useState(false)
  const [deletejob, setdeleteJob] = useState(false)
  const [error, setError] = useState("")
  const parseTime = (isoString) => {
    return isoString.split("T")[1].split("Z")[0]
  }
  const options = [
    { value: "Medio Tiempo", label: "Medio Tiempo" },
    { value: "Tiempo Completo", label: "Tiempo Completo" },
  ]

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
          setPuesto(dataa[i].puesto)
          setSalario(dataa[i].salario)
          setRequisitos(dataa[i].requisitos)
          setDetalles(dataa[i].descripcion)
          setJornada(dataa[i].jornada)
          setHorarioInicioDisplay(parseTime(dataa[i].hora_inicio))
          setHorarioFinDisplay(parseTime(dataa[i].hora_fin))
          // Mantén los valores completos para la actualización
          setHorarioInicioUpdate(dataa[i].hora_inicio)
          setHorarioFinUpdate(dataa[i].hora_fin)
          if (
            dataa[i].id_carreras !== null &&
            dataa[i].id_carreras.length > 0
          ) {
            setCarrera(dataa[i].id_carreras[0].toString()) // usar el primer elemento del array
          } else {
            setCarrera("1") // o cualquier valor predeterminado que desees
          }
        } else {
          console.log(carrera)
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
      console.log(horarioInicioUpdate)
      const details = JSON.stringify(quill.getContents())
      const apiResponse = await api.handleRequest("PUT", "/offers/", {
        id_empresa: user.id_user,
        id_oferta: parseInt(id, 10),
        puesto,
        descripcion: details,
        requisitos,
        salario: parseFloat(salario),
        id_carreras: [carrera],
        jornada,
        hora_inicio: horarioInicioUpdate,
        hora_fin: horarioFinUpdate,
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

  const handleCarrera = (e) => {
    setCarrera(e.value.toString())
  }

  const handleInputsValue = (e) => {
    switch (e.target.name) {
      case "salario":
        setSalario(e.target.value.toString())
        break
      case "requisitos":
        setRequisitos(e.target.value)
        break
      case "detalles":
        setDetalles(e.target.value)
        break
      case "puesto":
        setPuesto(e.target.value)
        break
      default:
        break
    }
  }

  const handleHorarioInputChange = (e) => {
    const { name, value } = e.target
    const timeValue = `0000-01-01T${value}:00Z`
    switch (name) {
      case "horarioinicio":
        setHorarioInicioDisplay(value)
        setHorarioInicioUpdate(timeValue)
        console.log(horarioInicioUpdate)
        break
      case "horariofin":
        setHorarioFinDisplay(value)
        setHorarioFinUpdate(timeValue)
        console.log(horarioFinUpdate)
        break
      default:
        break
    }
  }

  const handlePopupStatus = () => {
    setWarning(false)
  }

  const handleCancelJob = () => {
    setdeleteJob(false)
  }

  const succcessJobOffer = () => {
    setdeleteJob(false)
    setError("Oferta eliminada con éxito")
    setWarning(true)
    setTimeout(() => {
      navigate("/postulacionempresa")
    }, 4000)
  }

  const onclickAccept = async () => {
    const variableApi = `/offers/?id_oferta=${id}`
    const apiResponse = await api.handleRequest("DELETE", variableApi)
    if (apiResponse.status === 200) {
      succcessJobOffer()
    } else {
      setError("Upss algo salió mal, intentalo de nuevo")
      setWarning(true)
    }
  }

  const handleJornada = (e) => {
    setJornada(e.value)
  }

  return (
    <div className={styles.container}>
      <Popup status={warning} message={error} closePopup={handlePopupStatus} />
      <Popup
        status={deletejob}
        message={error}
        closePopup={onclickAccept}
        onClickcancel={handleCancelJob}
        canceloption
      />
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
          {horarioInicioDisplay && horarioFinDisplay && (
            <div className={styles.inputContainer}>
              <span>Horario</span>
              <span className={styles.horario}>Inicio</span>
              <input
                name="horarioinicio"
                type="time"
                onChange={handleHorarioInputChange}
                value={horarioInicioDisplay}
                className={styles.inputHorario}
              />
              <span className={styles.horario}>Fin</span>
              <input
                name="horariofin"
                type="time"
                onChange={handleHorarioInputChange}
                value={horarioFinDisplay}
                className={styles.inputHorario}
              />
            </div>
          )}
          <div className={styles.inputContainer}>
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
              options={options}
              value={options.find((option) => option.value === jornada)}
              onChange={handleJornada}
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
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary25: "#94bd0f",
                  primary: "#a08ae5",
                },
              })}
              options={carreras}
              value={carreras.find((option) => option.value === carrera)}
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
            backgroundColor="#ccc"
            onClick={handleRegresar}
            noborder
          />
          <Button
            label="Guardar"
            backgroundColor="#a08ae5"
            onClick={updateOffer}
            noborder
          />
        </div>
      </div>
    </div>
  )
}

export default OfferDetails
