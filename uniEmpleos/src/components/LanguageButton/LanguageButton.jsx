import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import i18n from "../../i18n"
import style from "./LanguageButton.module.css"
import useLanguage from "../../Hooks/useLanguage"

const LanguageButton = () => {
  const idiom = useLanguage()
  const [language, setLanguage] = useState(idiom.getLanguage())

  const changeLanguage = () => {
    const currentLanguage = idiom.getLanguage()
    idiom.changeLanguage()
    if (currentLanguage === "es") {
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
