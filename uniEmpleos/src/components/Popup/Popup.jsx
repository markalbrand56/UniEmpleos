import React, { useState, useEffect } from "react"
import "./Popup.css"

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
          src="/images/close.svg"
          alt="close"
          onClick={(event) => {
            event.preventDefault()
            console.log("cerrar popup: ", closed)
            setWarning(false)
          }}
        />
      )}
      <div className="popup-subcontainer1">
        <h1 className="popup-title">Advertencia</h1>
      </div>
      <div className="popup-subcontainer2">
        <img className="warning-img" src="/images/warning.svg" alt="warning" />
        <p className="popup-mensaje">{mensaje}</p>
      </div>
    </div>
  )
}

export default Popup
