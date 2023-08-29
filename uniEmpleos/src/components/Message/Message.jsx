import React from "react"
import PropTypes from "prop-types"
import style from "./Message.module.css"
import { format } from "date-fns"

const Message = ({ pfp, name, time, message, file, side }) => {
  
  const formatTime = format(new Date(time), "dd/MM/yyyy hh:mm a")

 return (
  <div
    className={style.messageContainer}
    style={{ alignItems: side === "right" ? "flex-end" : "flex-start" }}
  >
    <div className={style.header}>
      <div className={style.pfp}>
        <img src={pfp} alt={name} />
      </div>
      <div
        className={style.chatInfo}
        style={{ alignItems: side === "right" ? "flex-end" : "flex-start" }}
      >
        <div className={style.name}>{name}</div>
        <div className={style.time}>{formatTime}</div>
      </div>
    </div>
    <div className={style.content}>
      {message.length > 0 ? (
        <div
          className={style.message}
          style={{ backgroundColor: side === "right" ? "#9c8bdf" : "#9cbc3d" }}
        >
          {message}
        </div>
      ) : (
        <img src={file} className={style.file} alt={name} />
      )}
    </div>
  </div>
)}

Message.propTypes = {
  pfp: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  file: PropTypes.string.isRequired,
  side: PropTypes.string.isRequired,
}

export default Message
