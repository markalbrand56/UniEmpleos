import React from "react"
import ComponentInput from "../components/Input/Input"

function LogIn() {
  return (
    <div className="App">
      <ComponentInput placeholder="Usuario" />
      <ComponentInput placeholder="Contraseña" />
    </div>
  )
}

export default LogIn
