import React from "react"
import PropTypes from "prop-types"
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
}) => {
  return (
    <div className={styles.container}>
      {title && (
        <div className={styles.containerinfomain}>
          <h3>{title}</h3>
        </div>
      )}
      {company && (
        <div className={styles.containerinfosecond}>
          <p>{company}</p>
          {area && <p>{area}</p>}
        </div>
      )}
      {salary && (
        <div className={styles.containerinfothird}>
          <p>{salary}</p>
        </div>
      )}
      <div className={styles.button}>
        <Button label={labelbutton} onClick={onClick} />
        {verPostulantes && (
          <Button label="Ver postulantes" onClick={verPostulantes}backgroundColor={"#a08ae5"}/>
        )}
      </div>
    </div>
  )
}

InfoTab.propTypes = {
  title: PropTypes.string.isRequired,
  area: PropTypes.string.isRequired,
  salary: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  labelbutton: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  verPostulantes: PropTypes.func.isRequired,
}

export default InfoTab
