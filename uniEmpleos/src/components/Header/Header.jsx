import React, { useState } from "react"
import { useStoreon } from "storeon/react"
import PropTypes from "prop-types"
import { FaBars, FaTimes } from "react-icons/fa"
import {AiOutlineLogout} from "react-icons/ai"
import Logo from "../Logo/Logo"
import Button from "../Button/Button"
import "./header.css"
import { navigate } from "../../store"

const handleClick = () => {
  navigate("/login")
}

export const Header = () => {
  const [showNavbar, setShowNavbar] = useState(false)

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar)
  }

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
            <div className="actionlinks">
              <a href="/editprofileestudiante">Perfil</a>
              <a href="/profile">Vacantes</a>
              <a href="/chat">Chat</a>
              <a href="/postulaciones">Postulaciones</a>
            </div>
            <div className="buttonLogoutMobile" onClick={handleClick}>
              <AiOutlineLogout size={30} style={{ color: "#000" }} />
            </div>
          </div>
        )
      case "enterprise":
        return (
          <div className="actions">
            <div className="actionlinks">
              <a href="/newoffer">Añadir Empleo</a>
              <a href="/postulacionempresa">Mis Ofertas</a>
              <a href="/editprofileempresa">Profile</a>
              <a href="/chat">Chat</a>
            </div>
            <div className="buttonLogoutMobile" onClick={handleClick}>
              <AiOutlineLogout size={30} style={{ color: "#000" }} />
            </div>
          </div>
        )
      case "admin":
        return (
          <div className="actions">
            <div className="actionlinks">
              <a href="/jobs">Vacantes</a>
              <a href="/postulantes">Postulantes</a>
              <a href="/profile">Perfil</a>
            </div>
            <div className="buttonLogoutMobile" onClick={handleClick}>
              <AiOutlineLogout size={30} style={{ color: "#000" }} />
            </div>
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
    <nav className="navbar">
      <div className="container">
        <div className="logoheader">
          <button className="buttonlogo" onClick={handleHome} type="button">
            <Logo src="/images/Ue_2.svg" size={80} />
          </button>
        </div>
        <div className="menu-icon" onClick={handleShowNavbar}>
          {showNavbar ? (
            <FaTimes size={30} style={{ color: "#000" }} />
          ) : (
            <FaBars size={30} style={{ color: "#000" }} />
          )}
        </div>
        <div className={`nav-elements  ${showNavbar && "active"}`}>
          {renderActions()}
        </div>
      </div>
    </nav>
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
