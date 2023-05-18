import React from "react"
import styles from "./PrincipalEnterprise.module.css"
import InfoTab from "../../components/InfoTab/InfoTab"
import { Header } from "../../components/Header/Header"

const PrincipalEnterprise = () => {
  return (
    <div className={styles.container}>
      <Header userperson="company" />
      <div className={styles.containerinfomain}>
        <InfoTab
          title="Juan Pérez"
          area="Tech"
          salary="Q. 5,000.00"
          company="UVG"
          labelbutton="Ver perfil"
        />
        <InfoTab
          title="Título vacante/puesto"
          area="Área"
          salary="Q. 5,000.00"
          company="Empresa"
          labelbutton="Postularme"
        />
        <InfoTab
          title="Título vacante/puesto"
          area="Área"
          salary="Q. 5,000.00"
          company="Empresa"
          labelbutton="Postularme"
        />
        <InfoTab
          title="Título vacante/puesto"
          area="Área"
          salary="Q. 5,000.00"
          company="Empresa"
          labelbutton="Postularme"
        />
        <InfoTab
          title="Título vacante/puesto"
          area="Área"
          salary="Q. 5,000.00"
          company="Empresa"
          labelbutton="Postularme"
        />
        <InfoTab
          title="Título vacante/puesto"
          area="Área"
          salary="Q. 5,000.00"
          company="Empresa"
          labelbutton="Postularme"
        />
      </div>
    </div>
  )
}

export default PrincipalEnterprise
