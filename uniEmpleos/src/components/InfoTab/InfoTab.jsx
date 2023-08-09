import React from "react"
import PropTypes from "prop-types"
import styles from "./InfoTab.module.css"
import Button from "../Button/Button"

const InfoTab = ({ title, area, salary, company, labelbutton, onClick }) => {
  return (
    <div className={styles.container}>
      <div className={styles.containerinfomain}>
        <h3>{title}</h3>
      </div>
      <div className={styles.containerinfosecond}>
        <p>{company}</p>
        {area && <p>{area}</p>}
      </div>
      <div className={styles.containerinfothird}>
        <p>{salary}</p>
      </div>
      <div className={styles.button}>
        <Button label={labelbutton} onClick={onClick} />
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
}

export default InfoTab
