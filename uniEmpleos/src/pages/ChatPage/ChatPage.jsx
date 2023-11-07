/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from "react"
import { FaUserFriends } from "react-icons/fa"
import { useStoreon } from "storeon/react"
import style from "./ChatPage.module.css"
import { Header } from "../../components/Header/Header"
import Chat from "../../components/Chat/Chat"
import Message from "../../components/Message/Message"
import Input from "../../components/Input/Input"
import { navigate } from "../../store"
import useApi from "../../Hooks/useApi"
import Popup from "../../components/Popup/Popup"
import useIsImage from "../../Hooks/useIsImage"
import { formatDuration } from "date-fns"
import API_URL from "@/api.js"

const ChatPage = () => {
  const { user } = useStoreon("user")
  const apiLastChats = useApi()
  const apiMessages = useApi()
  const apiSendMessage = useApi()
  const isImage = useIsImage()

  const [currentChat, setCurrentChat] = useState("")
  const [textMessage, setTextMessage] = useState("")
  const [idCurrentChat, setIdCurrentChat] = useState()
  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")
  const [typePopUp, setTypePopUp] = useState(1)
  const chatContainerRef = useRef(null)
  const [cambioChats, setCambioChats] = useState([])

  const obtainLastChats = () => {
    apiLastChats.handleRequest("POST", "/messages/getLast", {
      id_usuario: user.id_user,
    })
  }

  const obtainMessages = async () => {
    if (currentChat !== "") {
      await apiMessages.handleRequest("POST", "/messages/get", {
        id_emisor: user.id_user,
        id_receptor: currentChat,
      })
      if (cambioChats !== apiMessages.data) {
        setCambioChats(apiMessages.data)
      }
    }
  }

  useEffect(() => {
    obtainMessages()
    if (currentChat !== "") {
      const intervalMensajesChatActual = setInterval(() => {
        obtainMessages()
      }, 5000)
      return () => clearInterval(intervalMensajesChatActual)
    }
  }, [currentChat])

  const scrollDown = () => {
    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    scrollDown()
  }, [cambioChats])

  const sendMessage = async () => {
    await apiSendMessage.handleRequest("POST", "/messages/send", {
      id_emisor: user.id_user,
      id_receptor: currentChat,
      mensaje: textMessage,
      id_postulacion: idCurrentChat,
    })
    scrollDown()
    obtainMessages()
  }

  const handleInputChange = (e) => {
    setTextMessage(e.target.value)
  }

  const handleSendMessage = () => {
    sendMessage()
    setTextMessage("")
    setUploadedImage("")
  }

  //Intervals
  // Actualizar lista de chats
  useEffect(() => {
    obtainLastChats()
    const intervalListadeChats = setInterval(() => {
      obtainLastChats()
    }, 5000)
    return () => clearInterval(intervalListadeChats)
  }, [])

  // Estado para controlar la visibilidad del contenedor de chats
  const [showChats, setShowChats] = useState(false)

  // Función para alternar la visibilidad del contenedor de chats
  const toggleChats = () => {
    setShowChats(!showChats)
  }

  const handleChat = (receptor, id) => {
    setCurrentChat(receptor)
    setIdCurrentChat(id)
    setShowChats(false)
  }

  return (
    <div className={style.container}>
      <Header userperson="student" />
      <Popup
        message={error}
        status={warning}
        style={typePopUp}
        close={() => setWarning(false)}
      />
      <button type="button" className={style.menuButton} onClick={toggleChats}>
        <FaUserFriends size={30} color="#000" />
      </button>
      <div className={style.generalChatContainer}>
        <div
          className={`${style.chatsContainer} ${
            showChats ? style.showChat : style.hideChat
          }`}
        >
          {apiLastChats.data && apiLastChats.data.messages.length > 0 ? (
            apiLastChats.data.messages.map((chat) =>
              chat.last_message.length === 0 ? null : (
                <Chat
                  pfp={
                    chat.user_photo
                      ? API_URL + "/api/uploads/" + chat.user_photo
                      : "/images/pfp.svg"
                  }
                  name={chat.user_name}
                  lastChat={
                    isImage(chat.last_message) ? "Foto" : chat.last_message
                  }
                  key={chat.postulation_id}
                  id_postulacion={chat.postulation_id.toString()}
                  onClick={() => handleChat(chat.user_id, chat.postulation_id)}
                />
              )
            )
          ) : (
            <div className={style.noUsersMessage}>No hay chats recientes.</div>
          )}
        </div>
        <div
          className={`${style.currentChatContainer} ${
            showChats ? style.hide : style.show
          }`}
          ref={chatContainerRef}
        >
          {apiMessages.data && apiMessages.data.messages.length > 0 ? (
            apiMessages.data.messages.map((message, number) => {
              const side = message.id_emisor === user.id_user ? "right" : "left"
              number += 1
              const fileType = isImage(message.mensaje)
              const pfpUrlEmisor = message.emisor_foto
                ? API_URL + "/api/uploads/" + message.emisor_foto
                : "/images/pfp.svg"
              return (
                <Message
                  key={[message.id, message.id_emisor, number]}
                  pfp={pfpUrlEmisor}
                  name={message.emisor_nombre}
                  time={message.tiempo}
                  message={fileType ? "" : message.mensaje}
                  file={fileType ? message.mensaje : ""}
                  side={side}
                />
              )
            })
          ) : (
            <div className={style.noMessagesMessage}>No hay mensajes.</div>
          )}
          <div className={style.inputContainer}>
            <div className={style.inputBar}>
              <Input
                name="message"
                type="text"
                value={textMessage}
                placeholder="Escribe un mensaje"
                onChange={handleInputChange}
              />
            </div>
            <div className={style.buttonSend}>
              <button
                type="button"
                className={style.button}
                style={{
                  backgroundColor:
                    (textMessage === "") ||
                    currentChat === ""
                      ? "#D6CFF2"
                      : "#9c8bdf",
                }}
                disabled={
                  (textMessage === "") ||
                  currentChat === ""
                }
                onClick={handleSendMessage}
              >
                <img src="/images/send.svg" alt="send" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
