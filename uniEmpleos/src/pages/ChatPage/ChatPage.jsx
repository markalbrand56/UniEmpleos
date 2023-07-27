/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react"
import { useStoreon } from "storeon/react"
import style from "./ChatPage.module.css"
import { Header } from "../../components/Header/Header"
import Chat from "../../components/Chat/Chat"
import Message from "../../components/Message/Message"
import Input from "../../components/Input/Input"
import { navigate } from "../../store"
import useApi from "../../Hooks/useApi"

const ChatPage = () => {
  const { user } = useStoreon("user")
  const api = useApi()

  useEffect(() => {
    api.handleRequest("POST", "/offers/all", { id_user: user.id_user })
  }, [])

  const [textMessage, setTextMessage] = useState("")

  const handleChat = () => {
    console.log("chat")
  }

  const handleInputChange = (e) => {
    setTextMessage(e.target.value)
  }

  const handleUploadFile = () => {
    console.log("upload")
  }

  const handleSendMessage = () => {
    console.log(textMessage)
    setTextMessage("")
  }

  const chats = [
    {
      pfp: "images/usuario.png",
      name: "Juan",
      lastChat: "Felicidades!!!",
    },
    {
      pfp: "images/usuario.png",
      name: "María",
      lastChat: "Hola, ¿cómo estás?",
    },
    {
      pfp: "images/usuario.png",
      name: "Carlos",
      lastChat: "Nos vemos mañana.",
    },
    {
      pfp: "images/usuario.png",
      name: "Luisa",
      lastChat: "¡Genial! Gracias por la ayuda.",
    },
    {
      pfp: "images/usuario.png",
      name: "Ana",
      lastChat: "¿Qué tal tu día?",
    },
    {
      pfp: "images/usuario.png",
      name: "Pedro",
      lastChat: "Estoy esperando tu respuesta.",
    },
    {
      pfp: "images/usuario.png",
      name: "Laura",
      lastChat: "Hoy es un buen día.",
    },
    {
      pfp: "images/usuario.png",
      name: "Pedro",
      lastChat: "Estoy esperando tu respuesta.",
    },
    {
      pfp: "images/usuario.png",
      name: "Laura",
      lastChat: "Hoy es un buen día.",
    },
    {
      pfp: "images/usuario.png",
      name: "Pedro",
      lastChat: "Estoy esperando tu respuesta.",
    },
    {
      pfp: "images/usuario.png",
      name: "Laura",
      lastChat: "Hoy es un buen día.",
    },
    {
      pfp: "images/usuario.png",
      name: "Pedro",
      lastChat: "Estoy esperando tu respuesta.",
    },
    {
      pfp: "images/usuario.png",
      name: "Laura",
      lastChat: "Hoy es un buen día.",
    },
  ]

  const messages = [
    {
      pfp: "images/usuario.png",
      name: "Juan",
      time: "12:00",
      message: "Hola que tal!",
      file: "images/usuario.png",
      side: "left",
    },
    {
      pfp: "images/usuario.png",
      name: "Juan",
      time: "12:00",
      message: "Hola que tal!",
      file: "images/usuario.png",
      side: "right",
    },
    {
      pfp: "images/usuario.png",
      name: "Juan",
      time: "12:00",
      message: "",
      file: "images/usuario.png",
      side: "left",
    },
    {
      pfp: "images/usuario.png",
      name: "Juan",
      time: "12:00",
      message: "Hola que tal!",
      file: "images/usuario.png",
      side: "left",
    },
    {
      pfp: "images/usuario.png",
      name: "Juan",
      time: "12:00",
      message: "",
      file: "images/usuario.png",
      side: "right",
    },
    {
      pfp: "images/usuario.png",
      name: "Juan",
      time: "12:00",
      message: "Que haces?",
      file: "images/usuario.png",
      side: "left",
    },
    {
      pfp: "images/usuario.png",
      name: "Juan",
      time: "12:00",
      message: "Hola que tal!",
      file: "images/usuario.png",
      side: "left",
    },
    {
      pfp: "images/usuario.png",
      name: "Juan",
      time: "12:00",
      message: "Hola que tal!",
      file: "images/usuario.png",
      side: "right",
    },
    {
      pfp: "images/usuario.png",
      name: "Juan",
      time: "12:00",
      message: "Que haces?",
      file: "images/usuario.png",
      side: "left",
    },
  ]

  return (
    <div className={style.container}>
      <Header userperson="student" />
      <div className={style.generalChatContainer}>
        <div className={style.chatsContainer}>
          {chats.length > 0 ? (
            chats.map((chat) => (
              <Chat
                pfp={chat.pfp}
                name={chat.name}
                lastChat={chat.lastChat}
                onClick={() => handleChat(chat.name)}
              />
            ))
          ) : (
            <div className={style.noUsersMessage}>No hay chats recientes.</div>
          )}
        </div>
        <div className={style.currentChatContainer}>
          {messages.length > 0 ? (
            messages.map((message) => (
              <Message
                pfp={message.pfp}
                name={message.name}
                time={message.time}
                message={message.message}
                file={message.file}
                side={message.side}
              />
            ))
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
            <div className={style.buttonFile}>
              <button
                type="button"
                className={style.button}
                style={{
                  backgroundColor: "#e0dede", // Opcional: color de fondo
                }}
                onClick={handleUploadFile}
              >
                <img src="/images/clip.svg" alt="upload files" />
              </button>
            </div>
            <div className={style.buttonSend}>
              <button
                type="button"
                className={style.button}
                style={{
                  backgroundColor: "#9c8bdf", // Opcional: color de fondo
                }}
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
