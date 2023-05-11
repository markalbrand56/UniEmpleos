import React from "react"
import PropTypes from "prop-types"

import Button from "../Boton/Button"
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
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none" fillRule="evenodd">
              <path
                d="M10 0h12a10 10 0 0110 10v12a10 10 0 01-10 10H10A10 10 0 010 22V10A10 10 0 0110 0z"
                fill="#FFF"
              />
              <path
                d="M5.3 10.6l10.4 6v11.1l-10.4-6v-11zm11.4-6.2l9.7 5.5-9.7 5.6V4.4z"
                fill="#555AB9"
              />
              <path
                d="M27.2 10.6v11.2l-10.5 6V16.5l10.5-6zM15.7 4.4v11L6 10l9.7-5.5z"
                fill="#91BAF8"
              />
            </g>
          </svg>
          <h1>UniEmpleos</h1>
          {renderActions()}
        </div>
        <div>
          {user ? (
            <>
              <span className="welcome">
                Welcome, <b>{user.name}</b>!
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
    name: PropTypes.string,
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