import React from "react"
import PropTypes from "prop-types"
import styles from "./Input.module.css"

const ComponentInput = ({ name, value, onChange, type, placeholder }) => {
  return (
    <div className={styles.inputContainer}>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}

ComponentInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
}

export default ComponentInput
