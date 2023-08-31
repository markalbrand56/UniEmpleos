import React from "react"
import PropTypes from "prop-types"
import styles from "./DropDown.module.css"

const DropDown = ({ opciones, value, onChange, name }) => {
  return (
    <div className={styles.dropDownContainer}>
      <select name={name} id={name} onChange={onChange} value={value} multiple>
        {opciones.map((skin) => (
          <option
            key={skin.value}
            value={skin.value}
            className={
              value && Array.isArray(value) && value.includes(skin.value)
                ? styles.selectedOption
                : ""
            }
          >
            {skin.label}
          </option>
        ))}
      </select>
    </div>
  )
}

DropDown.propTypes = {
  opciones: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default DropDown
