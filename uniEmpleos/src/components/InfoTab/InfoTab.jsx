import React from "react"
import PropTypes from "prop-types"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"
import styles from "./InfoTab.module.css"
import Button from "../Button/Button"

const InfoTab = ({
  title,
  area,
  salary,
  company,
  labelbutton,
  onClick,
  verPostulantes,
  horarioinicio,
  horariofin,
  jornada,
}) => {
  const { t } = useTranslation()
  const parseTime = (isoString) => {
    const date = isoString.split("T")[1].split("Z")[0].slice(0, -3)
    const hours = parseInt(date.split(":")[0], 10)
    if (hours > 12) {
      return `${hours - 12}:${date.split(":")[1]} p.m.`
    }
    if (hours === 12) {
      return `12:${date.split(":")[1]} p.m.`
    }
    if (hours === 0) {
      return `12:${date.split(":")[1]} a.m.`
    }
    return `${hours}:${date.split(":")[1]} a.m.`
  }

  return (
    <div className={styles.container}>
      {title && (
        <div className={styles.containerinfomain}>
          <h3>{title}</h3>
        </div>
      )}
      <div className={styles.containerinfosecond}>
        {company && (
          <p>
            {t("previewOffer.enterprise")}: {company}
          </p>
        )}
        {salary && (
          <p>
            {t("previewOffer.salary")}: {salary}
          </p>
        )}
        {jornada && (
          <p>
            {t("previewOffer.type")}: {jornada}
          </p>
        )}
        {horarioinicio && horariofin && (
          <p>
            {t("previewOffer.schedule")}: {parseTime(horarioinicio)} -{" "}
            {parseTime(horariofin)}
          </p>
        )}
      </div>
      <div className={styles.button}>
        <Button
          label={labelbutton}
          onClick={onClick}
          backgroundColor="#94bd0f"
          noborder
        />
        {verPostulantes && (
          <Button
            label={t("previewOffer.postulants")}
            onClick={verPostulantes}
            backgroundColor="#ccc"
            noborder
          />
        )}
      </div>
    </div>
  )
}

InfoTab.propTypes = {
  title: PropTypes.string.isRequired,
  area: PropTypes.string,
  salary: PropTypes.string.isRequired,
  company: PropTypes.string,
  labelbutton: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  verPostulantes: PropTypes.func.isRequired,
}

export default InfoTab
