import React from "react"
import style from "./Loader.module.css"

const Loader = ({ size }) => {
  const customStyle = [
    {
      "--d": "200ms",
    },
    {
      "--d": "400ms",
    },
    {
      "--d": "600ms",
    },
    {
      "--d": "800ms",
    },
    {
      "--d": "1000ms",
    },
  ]

  return (
    <div
      className={style.loader}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <span className={style.loader__bar} style={customStyle[0]}></span>
      <span className={style.loader__bar} style={customStyle[1]}></span>
      <span className={style.loader__bar} style={customStyle[2]}></span>
      <span className={style.loader__bar} style={customStyle[3]}></span>
      <span className={style.loader__bar} style={customStyle[4]}></span>
    </div>
  )
}

export default Loader
