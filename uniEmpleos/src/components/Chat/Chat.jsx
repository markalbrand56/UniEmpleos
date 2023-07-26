import React from "react"
import PropTypes from "prop-types"
import style from "./Chat.module.css"

const Chat = ({ pfp, lastChat, name, onClick }) => (
  <div className={style.buttonContainer}>
    <button type="button" onClick={onClick} className={style.button}>
      <div className={style.pfp}>
        <img src={pfp} alt={name} />
      </div>
      <div className={style.chatInfo}>
        <div className={style.name}>{name}</div>
        <div className={style.lastChat}>{lastChat}</div>
      </div>
    </button>
  </div>
)

Chat.propTypes = {
  onClick: PropTypes.func.isRequired,
  pfp: PropTypes.string.isRequired,
  lastChat: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

export default Chat
