/* eslint-disable arrow-body-style */
import React from "react"
import PropTypes, { string } from "prop-types"
import styles from "./DropDown.module.css"

const DropDown = ({ opciones, value, onChange }) => {
  return (
    <div className={styles.dropDownContainer}>
      <select id="dropdown" onChange={onChange} value={value}>
        {opciones.map((skin) => (
          <option key={skin.value} value={skin.value}>
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
      value: string.isRequired,
      label: string.isRequired,
    }),
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default DropDown
