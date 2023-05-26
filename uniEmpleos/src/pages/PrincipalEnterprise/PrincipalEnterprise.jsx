import React, { useEffect, useState } from "react"
import Joi from "joi"
import styles from "./PrincipalEnterprise.module.css"
import InfoTab from "../../components/InfoTab/InfoTab"
import { Header } from "../../components/Header/Header"
import useConfig from "../../Hooks/Useconfig"
import API_URL from "../../api"

const schema = Joi.object({
  token: Joi.string().required(),
})

const PrincipalEnterprise = () => {
  return (
    <div className={styles.container}>
      <Header userperson="company" />
      <div className={styles.containerinfoprincipal}>
        <h1>¡Bienvenido!</h1>
      </div>
    </div>
  )
}

export default PrincipalEnterprise
