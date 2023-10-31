import React, { useEffect, useState } from "react"
import style from "./PublicProfileAdminEnterprise.module.css"
import useApi from "../../Hooks/useApi"
import InfoTab from "../../components/InfoTab/InfoTab"
import Popup from "../../components/Popup/Popup"
import { BiArrowBack } from "react-icons/bi"
import { navigate } from "../../store"
import Loader from "../../components/Loader/Loader"
import PublicProfileAdmin from "../../components/PublicProfile/PublicProfileAdmin"
import API_URL from "../../api"

const PublicProfileAdminEnterprise = ({ id }) => {
  const enterpriseInfoApi = useApi()
  const offersApi = useApi()
  const api = useApi()

  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")
  const [typeError, setTypeError] = useState(1)
  const [enterpriseInfo, setEnterpriseInfo] = useState([])
  const [loadingInfoEnterprise, setLoadingInfoEnterprise] = useState(true)
  const [loadingOffers, setLoadingOffers] = useState(true)
  const [offers, setOffers] = useState([])

  const obtainEnterpriseInfo = async () => {
    const data = await enterpriseInfoApi.handleRequest(
      "POST",
      "/admins/details",
      {
        correo: id,
      }
    )
    if (data.status === 200) {
      if (data.data.company) {
        setEnterpriseInfo(data.data.company)
      } else {
        setTypeError(1)
        setError("Error al obtener la informacion de la empresa")
        setWarning(true)
      }
    } else {
      setTypeError(1)
      setError("Error al obtener la informacion de la empresa")
      setWarning(true)
    }
    setLoadingInfoEnterprise(false)
  }

  const obtainOffers = async () => {
    const data = await offersApi.handleRequest("POST", "/offers/company", {
      id_empresa: id,
    })
    if (data.status === 200) {
      setOffers(data.data.offers)
    } else {
      setTypeError(1)
      setError("Error al obtener las ofertas de la empresa")
      setWarning(true)
    }
    setLoadingOffers(false)
  }

  const suspendedUser = async () => {
    const data = await api.handleRequest("POST", "/admins/suspend", {
      id_usuario: id,
      suspender: !enterpriseInfo.suspendido,
    })
    if (data.status === 200) {
      if (data.message === "Account Reactivated Successfully") {
        setTypeError(3)
        setError("Cuenta reactivada exitosamente")
        setWarning(true)
      } else {
        setTypeError(3)
        setError("Cuenta suspendida exitosamente")
        setWarning(true)
      }
    } else {
      setTypeError(1)
      setError("Error al suspender la cuenta")
      setWarning(true)
    }
  }

  const deleteUser = async () => {
    const data = await api.handleRequest(
      "POST",
      `/admins/delete/user?usuario=${id}`
    )
    if (data.status === 200) {
      setTypeError(3)
      setError("Cuenta eliminada exitosamente")
      setWarning(true)
      setTimeout(() => {
        navigate("/profileadmin")
      }, 5000)
    } else {
      setTypeError(1)
      setError("Error al eliminar la cuenta")
      setWarning(true)
    }
  }

  const handleShowMore = (e) => {
    navigate(`/adminSPD/${e}`)
  }

  const handleSuspended = () => {
    setTimeout(() => {
      obtainEnterpriseInfo()
    }, 5000)
    suspendedUser()
  }

  const handleDelete = () => {
    deleteUser()
  }

  useEffect(() => {
    obtainEnterpriseInfo()
    obtainOffers()
  }, [])

  return (
    <div className={style.mainContainer}>
      <Popup
        message={error}
        status={warning}
        style={typeError}
        close={() => setWarning(false)}
      />
      <BiArrowBack
        size={30}
        style={{
          color: "#000",
          position: "absolute",
          top: "40px",
          left: "20px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/profileadmin")}
      />
      <div className={style.infoProfileContainer}>
        {loadingInfoEnterprise && enterpriseInfo ? (
          <Loader size={100} />
        ) : (
          <PublicProfileAdmin
            name={enterpriseInfo.nombre}
            mail={enterpriseInfo.correo}
            pfp={
              enterpriseInfo.foto === ""
                ? "/images/pfp.svg"
                : `${API_URL}/api/uploads/${enterpriseInfo.foto}`
            }
            suspended={enterpriseInfo.suspendido}
            funcSuspended={handleSuspended}
            funcDelete={handleDelete}
          />
        )}
      </div>
      <h1 className={style.title}>Ofertas de la empresa</h1>
      <div className={style.offersContainer}>
        {loadingOffers ? (
          <Loader size={100} />
        ) : offers ? (
          offers.map((offer) => (
            <InfoTab
              key={[offer.id_empresa, offer.id_oferta]}
              title={offer.puesto}
              salary={`Q.${offer.salario}.00`}
              company={enterpriseInfo.nombre}
              labelbutton="Ver más"
              onClick={() => {
                handleShowMore(offer.id_oferta)
              }}
            />
          ))
        ) : (
          <h1 style={{ color: "#000" }}>No hay ofertas</h1>
        )}
      </div>
    </div>
  )
}

export default PublicProfileAdminEnterprise
