import React from "react"
import styles from "./PrincipalStudent.module.css"
import InfoTab from "../../components/InfoTab/InfoTab"
import { Header } from "../../components/Header/Header"

const PrincipalStudent = () => {
  return (
    <div className={styles.container}>
      <Header userperson="student" />
      <div className={styles.containerinfomain}>
        <InfoTab
          title="Título vacante/puesto"
          area="Área"
          datepublished="2021-05-05"
          salary="Q. 5,000.00"
          company="Empresa"
          labelbutton="Postularme"
        />
        <InfoTab
          title="Título vacante/puesto"
          area="Área"
          datepublished="2021-05-05"
          salary="Q. 5,000.00"
          company="Empresa"
          labelbutton="Postularme"
        />
        <InfoTab
          title="Título vacante/puesto"
          area="Área"
          datepublished="2021-05-05"
          salary="Q. 5,000.00"
          company="Empresa"
          labelbutton="Postularme"
        />
        <InfoTab
          title="Título vacante/puesto"
          area="Área"
          datepublished="2021-05-05"
          salary="Q. 5,000.00"
          company="Empresa"
          labelbutton="Postularme"
        />
        <InfoTab
          title="Título vacante/puesto"
          area="Área"
          datepublished="2021-05-05"
          salary="Q. 5,000.00"
          company="Empresa"
          labelbutton="Postularme"
        />
        <InfoTab
          title="Título vacante/puesto"
          area="Área"
          datepublished="2021-05-05"
          salary="Q. 5,000.00"
          company="Empresa"
          labelbutton="Postularme"
        />
      </div>
    </div>
  )
}

export default PrincipalStudent
