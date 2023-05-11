import React from "react"
import PropTypes from "prop-types"
import Logo from "../Logo/Logo"
import Ue from "/images/Ue_1.svg"
import Button from "../Button/Button"
import "./header.css"

export const Header = ({
  user,
  onLogin,
  onLogout,
  onCreateAccount,
  userperson,
}) => {
  const renderActions = () => {
    switch (userperson) {
      case "student":
        return (
          <div className="actions">
            <a href="/jobs">Vacantes</a>
            <a href="/profile">Perfil</a>
          </div>
        )
      case "company":
        return (
          <div className="actions">
            <a href="postjob">Post a job</a>
            <a href="/postulantes">Postulantes</a>
            <a href="/profile">Profile</a>
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
          {user ? (
            <>
              <span className="welcome">
                Welcome, <b>{user.nombre}</b>!
              </span>
              <Button size="small" onClick={onLogout} label="Log out" />
            </>
          ) : (
            <>
              <Button size="small" onClick={onLogin} label="Log in" />
              <Button
                primary
                backgroundColor="#6E51D9"
                size="small"
                onClick={onCreateAccount}
                label="Sign up"
              />
            </>
          )}
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
