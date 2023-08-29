import React, { useState, useEffect } from "react"
import style from "./Popup.module.css"
import Button from "../Button/Button"

const Popup = ({
  message,
  status,
  closePopup,
  canceloption,
  onClickcancel,
}) => {
  // Si showPopup es false, el componente no se renderizará
  if (!status) {
    return null
  }

  return (
    <div className={style.mainContainer}>
      <span className={style.span}>{message}</span>
      <div className={style.buttonContainer}>
        <Button label="Ok" onClick={closePopup} textColor="#000" />
        {canceloption && (
          <Button label="Cancelar" onClick={onClickcancel} textColor="#000" />
        )}
      </div>
    </div>
  )
}

export default Popup
