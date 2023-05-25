import React from "react"
import { string } from "prop-types"
import style from "./OfertaInfo.module.css"

const OfertaInfo = ({ img, label }) => {
  return (
    <div className={style.generalContainer}>
      <div className={style.svgContainer}>
        <img src={img} alt={label} />
      </div>
      <div className={style.textContainer}>{label}</div>
    </div>
  )
}

OfertaInfo.propTypes = {
  img: string.isRequired,
  label: string.isRequired,
}

export default OfertaInfo
