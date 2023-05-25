import React, { useEffect, useState } from "react"
import style from "./EditProfileEmpresa.module.css"
import ComponentInput from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import TextArea from "../../components/textAreaAutosize/TextAreaAuto"

const EditProfileEmpresa = () => {
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
        setTelefono(e.target.value)
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

  const handleButton = () => {
    console.log("guardar")
  }

  useEffect(() => {
    console.log(nombre, correo, detalles, telefono, password)
  }, [nombre, correo, detalles, telefono, password])

  return (
    <div className={style.defaultContainer}>
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
                  name="nombre"
                  type="text"
                  placeholder="miEmpresa.org"
                  onChange={handleInputsValue}
                />
              </div>
              <div className={style.inputSubContainer}>
                <span>Telefono</span>
                <ComponentInput
                  name="telefono"
                  type="number"
                  placeholder="21212413"
                  onChange={handleInputsValue}
                />
              </div>
              <div className={style.inputSubContainer}>
                <span>Correo</span>
                <ComponentInput
                  name="correo"
                  type="text"
                  placeholder="empresa@org.com"
                  onChange={handleInputsValue}
                />
              </div>
              <div className={style.inputSubContainer}>
                <span>Contraseña</span>
                <ComponentInput
                  name="password"
                  type="password"
                  placeholder="miContraseña"
                  onChange={handleInputsValue}
                />
              </div>
              <div className={style.inputTextArea}>
                <span>Detalles</span>
                <TextArea
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
