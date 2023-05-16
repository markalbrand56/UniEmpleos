import React from "react"
import PropTypes from "prop-types"
import styles from "./ButtonImage.module.css"

function BotonImage({ src, alt, text, textColor, onClick }) {
  const spanStyle = {
    color: textColor,
  }
  return (
    <div className={styles.tipoUsuario}>
      <button type="button" onClick={onClick}>
        <span style={spanStyle}> {text} </span>
        <img src={src} alt={alt} />
      </button>
    </div>
  )
}

BotonImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default BotonImage
