import { useStoreon } from "storeon/react"
import { useState } from "react"

const useLanguage = () => {
  const { language, dispatch } = useStoreon("language")
  const [ currentLanguage, setCurrentLanguage ] = useState(language.currentLanguage)

  const changeLanguage = () => {
    if (language.currentLanguage === "es") {
      dispatch("language/config", {
        currentLanguage: "en",
      })
      setCurrentLanguage("en")
      return "en"
    } else {
      dispatch("language/config", {
        currentLanguage: "es",
      })
      setCurrentLanguage("es")
      return "es"
    }
  }

  const getLanguage = () => {
    return currentLanguage
  }

  return {
    currentLanguage,
    changeLanguage,
    getLanguage,
  }
}

export default useLanguage
