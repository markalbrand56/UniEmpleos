import React, { useEffect, useState } from "react"
import { useStoreon } from "storeon/react"
import style from "./EditProfileEmpresa.module.css"
import ComponentInput from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import TextArea from "../../components/textAreaAutosize/TextAreaAuto"
import { Header } from "../../components/Header/Header"
import { navigate } from "../../store"
import useApi from "../../Hooks/useApi"

const EditProfileEmpresa = () => {
  const api = useApi()
  const { user } = useStoreon("user")

  const [nombre, setNombre] = useState("")
  const [correo, setCorreo] = useState("")
  const [detalles, setDetalles] = useState("")
  const [telefono, setTelefono] = useState("")
  const [password, setPassword] = useState("")

  const handleInputsValue = (e) => {
    switch (e.target.name) {
      case "nombre":
        setNombre(e.target.value)
        break
      case "detalles":
        setDetalles(e.target.value)
        break
      case "telefono":
        if (e.target.value.length < 9) {
          setTelefono(e.target.value)
        }
        break
      case "correo":
        setCorreo(e.target.value)
        break
      case "password":
        setPassword(e.target.value)
        break
      default:
        break
    }
  }
  useEffect(() => {
    if (api.data) {
      setNombre(api.data.usuario.nombre)
      setCorreo(api.data.usuario.correo)
      setDetalles(api.data.usuario.detalles)
      setTelefono(parseInt(api.data.usuario.telefono, 10))
    }
  }, [api.data])

  useEffect(() => {
    api.handleRequest("GET", "/users/")
  }, [])

  const body = {
    nombre,
    detalles,
    correo,
    telefono: telefono.toString(),
    contra: " ",
  }
  const handleButton = () => {
    api.handleRequest("PUT", "/companies/update", body)
    navigate("/profilecompany")
  }

  return (
    <div className={style.defaultContainer}>
      <div className={style.headerContainer}>
        <Header userperson="company" />
      </div>
      <div className={style.contentContainer}>
        <div className={style.imgContainer}>
          <img src="/images/Ue_2.svg" alt="Foto de perfil" />
        </div>
        <div className={style.editProfileContainer}>
          <div className={style.inputsContainer}>
            <div className={style.grupoDatos1}>
              <div className={style.inputSubContainer}>
                <span>Nombre</span>
                <ComponentInput
                  value={nombre}
                  name="nombre"
                  type="text"
                  placeholder="miEmpresa.org"
                  onChange={handleInputsValue}
                />
              </div>
              <div className={style.inputSubContainer}>
                <span>Telefono</span>
                <ComponentInput
                  value={telefono}
                  name="telefono"
                  type="number"
                  placeholder="21212413"
                  onChange={handleInputsValue}
                />
              </div>
              <div className={style.inputSubContainer}>
                <span>Correo</span>
                <ComponentInput
                  value={correo}
                  name="correo"
                  type="text"
                  placeholder="empresa@org.com"
                  onChange={handleInputsValue}
                />
              </div>
              <div className={style.inputTextArea}>
                <span>Detalles</span>
                <TextArea
                  value={detalles}
                  name="detalles"
                  type="text"
                  placeholder="Detalles de la empresa"
                  onChange={handleInputsValue}
                  min={1}
                  max={5}
                />
              </div>
            </div>
            <div className={style.buttonContainer}>
              <Button label="Guardar" onClick={handleButton} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfileEmpresa
