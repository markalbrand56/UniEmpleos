import React, { useEffect, useState } from "react"
import { useStoreon } from "storeon/react"
import styles from "./PostulationsEmpresa.module.css"
import InfoTab from "../../components/InfoTab/InfoTab"
import { Header } from "../../components/Header/Header"
import useApi from "../../Hooks/useApi"

const PostulationsEmpresa = () => {
  const { user } = useStoreon("user")
  const api = useApi()

  const [dataa, setData] = useState([])

  useEffect(() => {
    console.log("DATAAAAA USEEFECT", api.data)
    if (api.data) {
      const { offers } = api.data
      setData(offers)
    }
    console.log("DATAAAAA", dataa)
  }, [api.data])

  useEffect(() => {
    api.handleRequest("POST", "/offers/company", {
      id_empresa: user.id_user,
    })
  }, [])

  return (
    <div className={styles.containePostulation}>
      <Header userperson="company" />
      {api.data ? (
        <div className={styles.containerinfoprincipal}>
          {dataa.map((postulation) => (
            <InfoTab
              title={postulation.puesto}
              area={postulation.nombre_carreras}
              salary={`Q.${postulation.salario}.00`}
              company={postulation.nombre_empresa}
              labelbutton="Ver más"
            />
          ))}
        </div>
      ) : (
        <div className={styles.containerinfomain}>
          <h1>No tiene niguna oferta activa</h1>
        </div>
      )}
    </div>
  )
}

export default PostulationsEmpresa
