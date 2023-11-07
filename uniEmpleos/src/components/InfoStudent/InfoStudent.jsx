import React from "react"
import PropTypes from "prop-types"
import style from "./InfoStudent.module.css"

const InfoStudent = ({
  nombre,
  apellido,
  universidad,
  pfp,
  onClick,
  showState,
  state,
}) => {
  return (
    <div className={style.mainContainer}>
      <button type="button" className={style.button} onClick={onClick}>
        <div className={style.pfpContainer}>
          <img className={style.pfp} src={pfp} alt={`${nombre} ${apellido}`} />
        </div>
        <div className={style.infoContainer}>
          {apellido ? (
            <span className={style.name}>{`${nombre} ${apellido}`}</span>
          ) : (
            <span className={style.name}>{`${nombre}`}</span>
          )}
          {universidad && (
            <span className={style.university}>{universidad}</span>
          )}
          {showState && (
            <div className={style.stateContainer}>
              <span>Estado:</span>
              <span style={state ? { color: "#FF0000" } : { color: "#000" }}>
                {state ? "Suspendido" : "Activo"}
              </span>
            </div>
          )}
        </div>
      </button>
    </div>
  )
}

InfoStudent.propTypes = {
  nombre: PropTypes.string.isRequired,
  apellido: PropTypes.string,
  universidad: PropTypes.string,
  pfp: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  estado: PropTypes.string,
}

export default InfoStudent
