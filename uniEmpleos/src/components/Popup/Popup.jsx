import React, { useState, useEffect } from "react"
import "./Popup.css"
import close from "/images/close.svg"
import warning from "/images/warning.svg"

const Popup = ({ message, setWarning, closable }) => {
  const [mensaje, setMensaje] = useState(message)

  useEffect(() => {
    setMensaje(message)
  }, [message])

  console.log("Renderizando popup")

  return (
    <div className="popup-container">
      {closable && (
        <img
          className="close-img"
          src={close}
          onClick={(event) => {
            event.preventDefault()
            console.log("cerrar popup: ", closed)
            setWarning(false)
          }}
        ></img>
      )}
      <div className="popup-subcontainer1">
        <h1 className="popup-title">Advertencia</h1>
      </div>
      <div className="popup-subcontainer2">
        <img className="warning-img" src={warning}></img>
        <p className="popup-mensaje">{mensaje}</p>
      </div>
    </div>
  )
}

export default Popup
