/* eslint-disable camelcase */
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
import ImageUploader from "../../components/ImageUploader/ImageUploader"

const ChatPage = () => {
  const { user } = useStoreon("user")
  const apiLastChats = useApi()
  const apiMessages = useApi()
  const apiSendMessage = useApi()

  const [lastChats, setLastChats] = useState([
    {
      chat_id: 1,
      user_name: "Empresa INC",
      user_photo: "/images/usuario.png",
      last_message:
        "Muchas gracias por la información. Estaré a la espera de su correo",
      last_time: "2023-05-18T02:51:32.554275Z",
    },
  ])
  const [messages, setMessages] = useState([
    {
      id_mensaje: 1,
      id_emisor: "cas21700@uvg.edu.gt",
      id_receptor: "hr@empresa.tec",
      mensaje:
        "Hola, me gustaria aplicar a la oferta de Desarrollador Web Junior. Me pueden dar mas infromación",
      tiempo: "2023-05-18T02:38:15.841209Z",
      emisor_nombre: "Mark",
      emisor_foto: "/images/usuario.png",
      receptor_nombre: "Empresa INC",
      receptor_foto: "",
      archivo: "",
    },
    {
      id_mensaje: 2,
      id_emisor: "hr@empresa.tec",
      id_receptor: "cas21700@uvg.edu.gt",
      mensaje:
        "Hola, gracias por su interés. Le enviaré a su correo más detalles de la propuesta",
      tiempo: "2023-05-18T02:48:48.644355Z",
      emisor_nombre: "Mark",
      emisor_foto: "/images/usuario.png",
      receptor_nombre: "Empresa INC",
      receptor_foto: "",
      archivo: "",
    },
  ])
  const [currentChat, setCurrentChat] = useState("")
  const [textMessage, setTextMessage] = useState("")
  const [uploadedImage, setUploadedImage] = useState("")

  const obtainLastChats = () => {
    apiLastChats.handleRequest("POST", "/messages/getLast", {
      id_user: user.id_user,
    })
    console.log("console", apiLastChats.data)
    if (apiLastChats.data) {
      console.log("Entro")
      setLastChats(apiLastChats.data.message)
    }
  }

  const obtainMessages = () => {
    apiMessages.handleRequest("POST", "/messages/get", {
      id_emisor: user.id_user,
      id_receptor: currentChat,
    })
    if (apiMessages.data) {
      setMessages(apiMessages.data.messages)
    }
  }

  const sendMessage = (id_postulacion) => {
    apiSendMessage.handleRequest("POST", "/messages/send", {
      id_emisor: user.id_user,
      id_receptor: currentChat,
      mensaje: textMessage,
      id_postulacion,
    })
    if (apiSendMessage.data) {
      setMessages(apiSendMessage.data.messages)
    }
  }

  const setObtainLastChats = () => {
    setTimeout(() => {
      obtainLastChats()
    }, 1000)
  }

  useEffect(() => {
    // setObtainLastChats()
    // obtainLastChats()
  }, [])

  const setObtainMessages = () => {
    setTimeout(() => {
      obtainMessages()
    }, 1000)
  }

  const handleChat = (receptor) => {
    setCurrentChat(receptor)
    obtainMessages()
    setObtainMessages()
  }

  const handleInputChange = (e) => {
    setTextMessage(e.target.value)
  }

  const handleUploadFile = (uploadedImage) => {
    setUploadedImage(uploadedImage)
  }

  const handleSendMessage = (e) => {
    //sendMessage(e.target.value)
    setTextMessage("")
    setUploadedImage("")
  }

  return (
    <div className={style.container}>
      <Header userperson="student" />
      <div className={style.generalChatContainer}>
        <div className={style.chatsContainer}>
          {lastChats.length > 0 ? (
            lastChats.map((chat) => (
              <Chat
                pfp={chat.user_photo}
                name={chat.user_name}
                lastChat={chat.last_message}
                key={["reclutamiento@sarita", chat.chat_id]}
                onClick={() => handleChat("reclutamiento@sarita")}
              />
            ))
          ) : (
            <div className={style.noUsersMessage}>No hay chats recientes.</div>
          )}
        </div>
        <div className={style.currentChatContainer}>
          {messages.length > 0 ? (
            messages.map((message) => {
              const side = message.id_emisor === user.id_user ? "right" : "left"
              return (
                <Message
                  key={message.id}
                  pfp={message.emisor_foto}
                  name={message.emisor_nombre}
                  time={message.tiempo}
                  message={message.mensaje}
                  file={message.archivo}
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
            <div className={style.buttonFile}>
              <ImageUploader onImageUpload={handleUploadFile} image={uploadedImage} />
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
