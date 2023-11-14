import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import i18n from "../../i18n"
import style from "./LanguageButton.module.css"

const LanguageButton = () => {
  const [language, setLanguage] = useState("es")

  const changeLanguage = () => {
    if (language === "es") {
      setLanguage("en")
      i18n.changeLanguage("en")
    } else {
      setLanguage("es")
      i18n.changeLanguage("es")
    }
  }

  return (
    <div className={style.languageButton}>
      <button
        type="button"
        className={style.mainButton}
        onClick={changeLanguage}
      >
        <img
          src={language === "es" ? "/images/en.svg" : "/images/es.svg"}
          alt="English"
          className={style.imgButton}
        />
      </button>
    </div>
  )
}

export default LanguageButton
