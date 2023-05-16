import React from "react"
import PropTypes from "prop-types"
import styles from "./Input.module.css"

const ComponentInput = ({ name, type, placeholder, onChange }) => {
  return (
    <div className={styles.inputContainer}>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  )
}

ComponentInput.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default ComponentInput
