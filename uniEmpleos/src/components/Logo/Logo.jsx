import React from "react"
import PropTypes from "prop-types"
import styles from "./Logo.module.css"

const Logo = ({ src, size }) => {
  return (
    <div className={styles.logoContainer}>
      <img
        src={src}
        alt="logo"
        style={{
          height: `${size}px`,
          width: `${size}px`,
        }}
      />
    </div>
  )
}

Logo.propTypes = {
  src: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
}

export default Logo
