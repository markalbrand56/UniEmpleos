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
import { useTranslation } from "react-i18next"

const Postulacion = () => {
  const { user } = useStoreon("user")
  const api = useApi()
  const apiCareers = useApi()
  const { t } = useTranslation()

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
      setError(t("newOffer.popUp.error1"))
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
        setError(t("newOffer.popUp.error2"))
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
    navigate("/postulacionempresa")
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
      <div className={style.titleContainer}>{t("newOffer.page.title")}</div>
        <div className={style.dataContainer}>
          <div className={style.inputContainer}>
            <span>{t("newOffer.page.position")}</span>
            <ComponentInput
              name="puesto"
              type="text"
              placeholder="Frontend Developer"
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputContainer}>
            <span>{t("newOffer.page.salary")}</span>
            <ComponentInput
              name="salario"
              type="number"
              placeholder="Q5000.00"
              onChange={handleInputsValue}
            />
          </div>
          <div className={style.inputContainer}>
            <span>{t("newOffer.page.schedule")}</span>
            <div className={style.horarioContainer}>
              <span className={style.horario}>{t("newOffer.page.startShift")} (am)</span>
              <ComponentInput
                name="horarioinicio"
                type="time"
                onChange={handleInputsValue}
              />
              <span className={style.horario}>{t("newOffer.page.endShift")} (pm)</span>
              <ComponentInput
                name="horariofin"
                type="time"
                onChange={handleInputsValue}
              />
            </div>
          </div>
          <div className={style.inputContainer}>
            <span>{t("newOffer.page.jornada")}</span>
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
                      { value: "Medio Tiempo", label: t("newOffer.page.partTime") },
                      { value: "Tiempo Completo", label: t("newOffer.page.fullTime") },
                    ]
                  : [
                      { value: jornada, label: jornada },
                      { value: "Medio Tiempo", label: t("newOffer.page.partTime") },
                      { value: "Tiempo Completo", label: t("newOffer.page.fullTime") },
                    ]
              }
              value={carreras.find((option) => option.label === carrera)}
              onChange={handleJornada}
            />
          </div>
          <div className={style.inputContainer}>
            <span>{t("newOffer.page.career")}</span>
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
            <span>{t("newOffer.page.requirements")}</span>
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
            <span>{t("newOffer.page.description")}</span>
            <div ref={quillRef} />
          </div>
        </div>
        <div className={style.buttonContainer}>
          <Button
            label={t("newOffer.page.return")}
            backgroundColor="#ccc"
            onClick={handleRegresar}
            noborder
          />
          <Button
            label={t("newOffer.page.create")}
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
