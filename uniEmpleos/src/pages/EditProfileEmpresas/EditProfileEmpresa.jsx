import React, { useEffect, useState } from "react"
import Joi from "joi"
import useConfig from "../../Hooks/Useconfig"
import API_URL from "../../api"
import style from "./EditProfileEmpresa.module.css"
import ComponentInput from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import TextArea from "../../components/textAreaAutosize/TextAreaAuto"
import { Header } from "../../components/Header/Header"
import { navigate } from "../../store"

const schema = Joi.object({
  token: Joi.string().required(),
})

const EditProfileEmpresa = () => {
  const form = useConfig(schema, {
    token: "a",
  })

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

  const putCompanyData = async () => {
    const body = {
      nombre,
      detalles,
      correo,
      telefono,
      contra: password,
    }
    const response = await fetch(`${API_URL}/api/companies/update`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${form.values.token}`,
      },
    })

    const datos = await response.json() // Recibidos
    console.log("datos", datos)

    if (datos.status === 200) {
      console.log("Actualizacion de los datos exitosa")
      navigate("/profilecompany")
    }
  }

  const obtainUserData = async () => {
    const response = await fetch(`${API_URL}/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${form.values.token}`,
      },
    })
    const datos = await response.json()
    if (datos.status === 200) {
      console.log(datos.data)
      setNombre(datos.data.nombre)
      setCorreo(datos.data.correo)
      setDetalles(datos.data.detalles)
      setTelefono(datos.data.telefono)
      setPassword(datos.data.contra)
    }
  }

  useEffect(() => {
    console.log("token--->", form.values.token)
  }, [form])

  useEffect(() => {
    // obtainUserData()
  }, [])

  const handleButton = () => {
    putCompanyData()
  }

  useEffect(() => {
    console.log(nombre, correo, detalles, telefono, password)
  }, [nombre, correo, detalles, telefono, password])

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
              <div className={style.inputSubContainer}>
                <span>Contraseña</span>
                <ComponentInput
                  value={password}
                  name="password"
                  type="password"
                  placeholder="miContraseña"
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
