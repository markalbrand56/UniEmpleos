import React from "react"
import Joi from "joi"
import PropTypes from "prop-types"
import useConfig from "../../Hooks/Useconfig"
import Logo from "../Logo/Logo"
import Ue from "/images/Ue_2.svg"
import Button from "../Button/Button"
import "./header.css"
import { navigate } from "../../store"

const handleClick = () => {
  navigate("/login")
}

const schema = Joi.object({
  token: Joi.string().required(),
  rol: Joi.string().required(),
})

export const Header = ({
  user,
  onLogin,
  onLogout,
  onCreateAccount,
  userperson,
}) => {
  const form = useConfig(schema, {
    token: "a",
    role: "a",
  })
  const renderActions = () => {
    switch (form.values.role) {
      case "student":
        return (
          <div className="actions">
            <a href="/editprofileestudiante">Perfil</a>
            <a href="/profile">Vacantes</a>
          </div>
        )
      case "enterprise":
        return (
          <div className="actions">
            <a href="/postulacion">Añadir Empleo</a>
            <a href="/postulantes">Postulantes</a>
            <a href="/postulacionempresa">Mis Postulaciones</a>
            <a href="/editprofileempresa">Profile</a>
          </div>
        )
      case "admin":
        return (
          <div className="actions">
            <a href="/jobs">Vacantes</a>
            <a href="/postulantes">Postulantes</a>
            <a href="/profile">Perfil</a>
          </div>
        )
      default:
        return (
          <div className="actions">
            <a href="/jobs">Vacantes</a>
            <a href="/postulantes">Postulantes</a>
            <a href="/profile">Perfil</a>
          </div>
        )
    }
  }
  return (
    <header>
      <div className="wrapper">
        <div className="headercontainer">
          <div className="logo">
            <Logo src={Ue} size={80} />
          </div>
          {renderActions()}
        </div>
        <div>
          <Button
            backgroundColor="#a08ae5"
            label="Log Out"
            onClick={handleClick}
          />
        </div>
      </div>
    </header>
  )
}

Header.propTypes = {
  user: PropTypes.shape({
    nombre: PropTypes.string,
  }),
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onCreateAccount: PropTypes.func.isRequired,
  userperson: PropTypes.string.isRequired,
}

Header.defaultProps = {
  user: null,
}

export default Header
