import React from "react"
import { useStoreon } from "storeon/react"
import PropTypes from "prop-types"
import Logo from "../Logo/Logo"
import Button from "../Button/Button"
import "./header.css"
import { navigate } from "../../store"

const handleClick = () => {
  navigate("/login")
}

export const Header = () => {
  const { user } = useStoreon("user")
  const handleHome = () => {
    switch (user.role) {
      case "student":
        navigate("/profile")
        break
      case "enterprise":
        navigate("/profilecompany")
        break
      case "admin":
        navigate("/profile")
        break
      default:
        navigate("/jobs")
        break
    }
  }
  const renderActions = () => {
    switch (user.role) {
      case "student":
        return (
          <div className="actions">
            <a href="/editprofileestudiante">Perfil</a>
            <a href="/profile">Vacantes</a>
            <a href="/chat">Chat</a>
          </div>
        )
      case "enterprise":
        return (
          <div className="actions">
            <a href="/newoffer">Añadir Empleo</a>
            <a href="/postulacionempresa">Mis Ofertas</a>
            <a href="/editprofileempresa">Profile</a>
            <a href="/chat">Chat</a>
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
            <button className="buttonlogo" onClick={handleHome} type="button">
              <Logo src="/images/Ue_2.svg" size={80} />
            </button>
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
}

Header.defaultProps = {
  user: null,
}

export default Header
