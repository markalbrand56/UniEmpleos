import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import i18n from "../../i18n"
import style from "./LanguageButton.module.css"

const LanguageButton = () => {
  const [language, setLanguage] = useState("en")

  const changeLanguage = () => {
    if (language === "es") {
      setLanguage("en")
      console.log("en")
      i18n.changeLanguage("en")
    } else {
      setLanguage("es")
        console.log("es")
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
          src={language === "en" ? "/images/es.svg" : "/images/en.svg"}
          alt="English"
          className={style.imgButton}
        />
      </button>
    </div>
  )
}

export default LanguageButton
