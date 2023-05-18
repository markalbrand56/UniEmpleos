import React from "react"
import styles from "./PrincipalStudent.module.css"
import InfoTab from "../../components/InfoTab/InfoTab"
import { Header } from "../../components/Header/Header"
import useConfig from "../../Hooks/Useconfig"
import Joi from "joi"

const schema = Joi.object({
  token: Joi.string().required(),
})

const PrincipalStudent = () => {
  const form = useConfig(schema, {
    token: "a",
  })

  console.log(form.values.token)
  return (
    <div className={styles.container}>
      <Header userperson="student" />
      <div className={styles.containerinfomain}>
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

export default PrincipalStudent
