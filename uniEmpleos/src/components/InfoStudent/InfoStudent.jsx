import React from "react"
import PropTypes from "prop-types"
import style from "./InfoStudent.module.css"

const InfoStudent = ({ nombre, apellido, universidad, pfp, onClick }) => {
  return (
    <div className={style.mainContainer}>
      <button type="button" className={style.button} onClick={onClick}>
        <div className={style.pfpContainer}>
          <img className={style.pfp} src={pfp} alt={`${nombre} ${apellido}`} />
        </div>
        <div className={style.infoContainer}>
          <span className={style.name}>{`${nombre} ${apellido}`}</span>
          <span className={style.university}>{universidad}</span>
        </div>
      </button>
    </div>
  )
}

InfoStudent.propTypes = {
  nombre: PropTypes.string.isRequired,
  apellido: PropTypes.string.isRequired,
  universidad: PropTypes.string.isRequired,
  pfp: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default InfoStudent
