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
import Popup from "../../components/Popup/Popup"
import useIsImage from "../../Hooks/useIsImage"

const ChatPage = () => {
  const { user } = useStoreon("user")
  const apiLastChats = useApi()
  const apiMessages = useApi()
  const apiSendMessage = useApi()
  const isImage = useIsImage()

  const [currentChat, setCurrentChat] = useState("")
  const [textMessage, setTextMessage] = useState("")
  const [uploadedImage, setUploadedImage] = useState("")
  const [idCurrentChat, setIdCurrentChat] = useState()
  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")

  const obtainLastChats = () => {
    apiLastChats.handleRequest("POST", "/messages/getLast", {
      id_usuario: user.id_user,
    })
  }

  useEffect(() => {
    obtainMessages()
  }, [currentChat])

  const obtainMessages = () => {
    if (currentChat !== "") {
      apiMessages.handleRequest("POST", "/messages/get", {
        id_emisor: user.id_user,
        id_receptor: currentChat,
      })
    }
  }

  const sendMessage = async () => {
    if (uploadedImage !== "" && textMessage !== "") {
      await apiSendMessage.handleRequest("POST", "/messages/send", {
        id_emisor: user.id_user,
        id_receptor: currentChat,
        mensaje: textMessage,
        id_postulacion: idCurrentChat,
      })
      await apiSendMessage.handleRequest("POST", "/messages/send", {
        id_emisor: user.id_user,
        id_receptor: currentChat,
        mensaje: uploadedImage,
        id_postulacion: idCurrentChat,
      })
    } else if (uploadedImage === "") {
      await apiSendMessage.handleRequest("POST", "/messages/send", {
        id_emisor: user.id_user,
        id_receptor: currentChat,
        mensaje: textMessage,
        id_postulacion: idCurrentChat,
      })
    } else if (textMessage === "") {
      await apiSendMessage.handleRequest("POST", "/messages/send", {
        id_emisor: user.id_user,
        id_receptor: currentChat,
        mensaje: uploadedImage,
        id_postulacion: idCurrentChat,
      })
    }
    obtainMessages()
  }

  const handleChat = (receptor, id) => {
    setCurrentChat(receptor)
    setIdCurrentChat(id)
  }

  const handleInputChange = (e) => {
    setTextMessage(e.target.value)
  }

  const handleUploadFile = (uploadedImage) => {
    const fileType = isImage(uploadedImage)
    if (fileType) {
      setUploadedImage(uploadedImage)
    } else {
      setError("El archivo debe ser una imagen")
      setWarning(true)
    }
  }

  const handleSendMessage = () => {
    sendMessage()
    setTextMessage("")
    setUploadedImage("")
  }

  const handelPopupStatus = () => {
    setWarning(false)
  }

  //Intervals
  // Actualizar lista de chats

  useEffect(() => {
    obtainLastChats()
    const intervalListadeChats = setInterval(() => {
      obtainLastChats()
    }, 10000)
    return () => clearInterval(intervalListadeChats)
  }, [])

  // Actualizar mensajes de chat actual

  useEffect(() => {
    const intervalMensajesChatActual = setInterval(() => {
      obtainMessages()
    }, 10000)
    return () => clearInterval(intervalMensajesChatActual)
  }, [])

  // console.log(apiMessages.data)
  // console.log(user.id_user)
  // console.log(apiLastChats.data)

  return (
    <div className={style.container}>
      <Header userperson="student" />
      <Popup message={error} status={warning} closePopup={handelPopupStatus} />
      <div className={style.generalChatContainer}>
        <div className={style.chatsContainer}>
          {apiLastChats.data && apiLastChats.data.messages.length > 0 ? (
            apiLastChats.data.messages.map((chat) => {
              if (chat.last_message.length === 0) {
                return null
              } else {
                const fileType = isImage(chat.last_message)
                if (fileType) {
                  return (
                    <Chat
                      pfp={
                        chat.user_photo ? chat.user_photo : "/images/pfp.svg"
                      }
                      name={chat.user_name}
                      lastChat="Foto"
                      key={chat.postulation_id}
                      id_postulacion={chat.postulation_id.toString()}
                      onClick={() =>
                        handleChat(chat.user_id, chat.postulation_id)
                      }
                    />
                  )
                } else {
                  return (
                    <Chat
                      pfp={
                        chat.user_photo ? chat.user_photo : "/images/pfp.svg"
                      }
                      name={chat.user_name}
                      lastChat={chat.last_message}
                      key={chat.postulation_id}
                      id_postulacion={chat.postulation_id.toString()}
                      onClick={() =>
                        handleChat(chat.user_id, chat.postulation_id)
                      }
                    />
                  )
                }
              }
            })
          ) : (
            <div className={style.noUsersMessage}>No hay chats recientes.</div>
          )}
        </div>
        <div className={style.currentChatContainer}>
          {apiMessages.data && apiMessages.data.messages.length > 0 ? (
            apiMessages.data.messages.map((message, number) => {
              const side = message.id_emisor === user.id_user ? "right" : "left"
              number += 1
              const fileType = isImage(message.mensaje)
              if (fileType) {
                return (
                  <Message
                    key={[message.id, message.id_emisor, number]}
                    pfp={message.emisor_foto}
                    name={message.emisor_nombre}
                    time={message.tiempo}
                    message=""
                    file={message.mensaje}
                    side={side}
                  />
                )
              } else {
                return (
                  <Message
                    key={[message.id, message.id_emisor, number]}
                    pfp={message.emisor_foto}
                    name={message.emisor_nombre}
                    time={message.tiempo}
                    message={message.mensaje}
                    file=""
                    side={side}
                  />
                )
              }
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
            <div
              className={style.buttonFile}
              style={uploadedImage === "" ? { width: "5%" } : { width: "15%" }}
            >
              <ImageUploader
                onImageUpload={handleUploadFile}
                image={uploadedImage}
              />
              {uploadedImage === "" ? null : (
                <button
                  type="button"
                  className={style.deleteImageButton}
                  onClick={() => setUploadedImage("")}
                  alt="Eliminar imagen"
                >
                  <img src="/images/delete.svg" alt="delete" />
                </button>
              )}
            </div>
            <div className={style.buttonSend}>
              <button
                type="button"
                className={style.button}
                style={{
                  backgroundColor:
                    (textMessage === "" && uploadedImage === "") ||
                    currentChat === ""
                      ? "#D6CFF2"
                      : "#9c8bdf",
                }}
                disabled={
                  (textMessage === "" && uploadedImage === "") ||
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
