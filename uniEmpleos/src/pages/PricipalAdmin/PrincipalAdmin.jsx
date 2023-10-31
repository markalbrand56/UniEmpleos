import React, { useEffect, useState } from "react"
import style from "./PrincipalAdmin.module.css"
import useApi from "../../Hooks/useApi"
import Popup from "../../components/Popup/Popup"
import Header from "../../components/Header/Header"
import Loader from "../../components/Loader/Loader"
import API_URL from "../../api"
import InfoStudent from "../../components/InfoStudent/InfoStudent"
import { navigate } from "../../store"


const PrincipalAdmin = () => {
  const enterprisesApi = useApi()
  const [enterprises, setEnterprises] = useState([])
  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")
  const [typeError, setTypeError] = useState(1)
  const [loading, setLoading] = useState(true)

  const obtainEnterprises = async () => {
    const data = await enterprisesApi.handleRequest("GET", "/admins/companies")
    if (data.status === 200) {
      setEnterprises(data.data)
    } else {
      setTypeError(1)
      setError("Ups, algo salio mal al obtener las empresas")
      setWarning(true)
    }
    setLoading(false)
  }

  const handleClick = (e) => {
    navigate(`/publicProfileAdminEnterprise/${e}`)
  }

  useEffect(() => {
    obtainEnterprises()
  }, [])

  return (
    <div className={style.mainContainer}>
      <Header />
      <Popup
        message={error}
        status={warning}
        style={typeError}
        close={() => setWarning(false)}
      />
      {loading ? (
        <Loader size={100} />
      ) : (
        <div className={style.enterprisesContainer}>
          {enterprises.companies ? (
            enterprises.companies.map((enterprise) => {
              const pfpUrlEmisor =
                enterprise.foto === ""
                  ? "/images/pfp.svg"
                  : `${API_URL}/api/uploads/${enterprise.foto}`
              return (
                <InfoStudent
                  key={enterprise.id_empresa}
                  nombre={enterprise.nombre}
                  pfp={pfpUrlEmisor}
                  onClick={() => {
                    handleClick(enterprise.id_empresa)
                  }}
                  showState
                  state={enterprise.suspendido}
                />
              )
            })
          ) : (
            <h1 style={{color: "#000"}}>No hay empresas</h1>
          )}
        </div>
      )}
    </div>
  )
}

export default PrincipalAdmin
