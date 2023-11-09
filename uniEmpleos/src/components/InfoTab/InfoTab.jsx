import React from "react"
import PropTypes from "prop-types"
import styles from "./InfoTab.module.css"
import Button from "../Button/Button"
import { format } from "date-fns"

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
  const formatTimeInicio = format(new Date(horarioinicio), "hh:mm a")
  const formatTimeFin = format(new Date(horariofin), "hh:mm a")
  return (
    <div className={styles.container}>
      {title && (
        <div className={styles.containerinfomain}>
          <h3>{title}</h3>
        </div>
      )}
      <div className={styles.containerinfosecond}>
        {company && <p>{`Empresa: ${company}`}</p>}
        {salary && <p>{`Salario: ${salary}`}</p>}
        {jornada && <p>{`Jornada: ${jornada}`}</p>}
        {horarioinicio && (
          <p>{`Horario: ${formatTimeInicio} - ${formatTimeFin}`}</p>
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
            label="Ver postulantes"
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
