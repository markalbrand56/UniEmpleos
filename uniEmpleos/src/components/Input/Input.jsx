import React from "react"
import { Input } from "./Input.module.css"

const ComponentInput = ({ placeholder }) => {
  return (
    <div className={Input}>
      <input type="text" placeholder={placeholder} />
    </div>
  )
}

export default ComponentInput
