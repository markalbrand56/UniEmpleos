import React, { useEffect, useState } from "react"
import { IoSearchCircle } from "react-icons/io5"
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

  const [searchTerm, setSearchTerm] = useState("")

  const [showSearch, setShowSearch] = useState(false)

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredEnterprises = enterprises.companies
    ? enterprises.companies.filter((enterprise) =>
        enterprise.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

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
      <div className={style.searchContainer}>
        <IoSearchCircle
          size={40}
          color="#94bd0f"
          onClick={() => setShowSearch(!showSearch)}
        />
        {showSearch && (
          <input
            className={style.searchBar}
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        )}
      </div>
      {loading ? (
        <Loader size={100} />
      ) : (
        <div className={style.enterprisesContainer}>
          {filteredEnterprises.length > 0 ? (
            filteredEnterprises.map((enterprise) => {
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
