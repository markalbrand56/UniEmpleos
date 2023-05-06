import React from "react"
import PropTypes from "prop-types"
import styles from "./ButtonImage.module.css"

function BotonImage({ src, alt, text, textColor }) {
  const spanStyle = {
    color: textColor,
  }
  return (
    <div className={styles.tipoUsuario}>
      <button type="button">
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
}

export default BotonImage
