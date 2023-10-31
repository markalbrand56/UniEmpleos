import React from "react"
import style from "./PublicProfileAdmin.module.css"
import { BiUser } from "react-icons/bi"
import { HiOutlineMailOpen } from "react-icons/hi"
import Button from "../Button/Button"
const PublicProfileAdmin = ({
  name,
  lastName,
  mail,
  pfp,
  suspended,
  funcSuspended,
  funcDelete,
}) => {
  return (
    <div className={style.mainContainer}>
      <div className={style.pfpContainer}>
        <img className={style.pfp} src={pfp} alt={`${name}`} />
      </div>
      <div className={style.infoContainer}>
        <div className={style.nameContainer}>
          <BiUser size={30} />
          {lastName ? (
            <span className={style.name}>{`${name} ${lastName}`}</span>
          ) : (
            <span className={style.name}>{name}</span>
          )}
        </div>
        <div className={style.mailContainer}>
          <HiOutlineMailOpen size={30} />
          <span className={style.info}>{mail}</span>
        </div>
        <div className={style.suspendedContainer}>
          <Button
            label={suspended ? "Activar" : "Suspender"}
            backgroundColor={suspended ? "#00FF00" : "#FF0000"}
            textColor="#FFFFFF"
            onClick={funcSuspended}
          />
          <Button 
            label="Eliminar"
            backgroundColor="#FF0000"
            textColor="#FFFFFF"
            onClick={funcDelete}
          />
        </div>
      </div>
    </div>
  )
}

export default PublicProfileAdmin
