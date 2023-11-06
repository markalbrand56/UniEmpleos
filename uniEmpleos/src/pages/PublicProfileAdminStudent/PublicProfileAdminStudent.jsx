import React, { useState, useEffect } from "react"
import style from "./PublicProfileAdminStudent.module.css"
import PublicProfileAdmin from "../../components/PublicProfile/PublicProfileAdmin"
import InfoTab from "../../components/InfoTab/InfoTab"
import useApi from "../../Hooks/useApi"
import Popup from "../../components/Popup/Popup"
import { navigate } from "../../store"
import { BiArrowBack } from "react-icons/bi"
import Loader from "../../components/Loader/Loader"
import API_URL from "../../api"

const PublicProfileAdminStudent = ({ id }) => {
  const studentInfoApi = useApi()
  const postulationsApi = useApi()
  const api = useApi()

  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")
  const [typeError, setTypeError] = useState(1)
  const [postulations, setPostulations] = useState([])
  const [studentInfo, setStudentInfo] = useState([])
  const [loadingInfoStudent, setLoadingInfoStudent] = useState(true)
  const [loadingPostulations, setLoadingPostulations] = useState(true)

  const obtainStudentInfo = async () => {
    const data = await studentInfoApi.handleRequest("POST", "/admins/details", {
      correo: id,
    })

    if (data.status === 200) {
      if (data.data.student) {
        setStudentInfo(data.data.student)
      } else {
        setTypeError(1)
        setError("Error al obtener la informacion del estudiante")
        setWarning(true)
      }
    } else {
      setTypeError(1)
      setError("Error al obtener la informacion del estudiante")
      setWarning(true)
    }
    setLoadingInfoStudent(false)
  }

  const obtainPostulationsStudent = async () => {
    const data = await postulationsApi.handleRequest(
      "POST",
      `/admins/postulations?id_estudiante=${id}`
    )
    if (data.status === 200) {
      setPostulations(data.data.postulations)
    } else {
      setTypeError(1)
      setError("Error al obtener las postulaciones")
      setWarning(true)
    }
    setLoadingPostulations(false)
  }

  const suspendedStudent = async () => {
    const data = await api.handleRequest("POST", "/admins/suspend", {
      id_usuario: id,
      suspender: !studentInfo.suspendido,
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

  const deleteStudent = async () => {
    const data = await api.handleRequest(
      "POST",
      `/admins/delete/user?usuario=${id}`
    )
    if (data.status === 200) {
      setTypeError(3)
      setError("Cuenta eliminada exitosamente")
      setWarning(true)
      setTimeout(() => {
        navigate("/profileadminstudent")
      }, 5000)
    } else {
      setTypeError(1)
      setError("Error al eliminar la cuenta")
      setWarning(true)
    }
  }

  const handleSuspended = () => {
    setTimeout(() => {
      obtainStudentInfo()
    }, 5000)
    suspendedStudent()
  }

  const handleDelete = () => {
    deleteStudent()
  }

  const handleShowMore = (id_oferta, id_postulacion) => {
    navigate(`/adminSPDS/${id_oferta}-${id_postulacion}-${id}`)
  }

  useEffect(() => {
    obtainStudentInfo()
    obtainPostulationsStudent()
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
        onClick={() => navigate("/profileadminstudent")}
      />
      <div className={style.infoProfileContainer}>
        {loadingInfoStudent && studentInfo ? (
          <Loader size={200} />
        ) : (
          <PublicProfileAdmin
            name={studentInfo.nombre}
            lastName={studentInfo.apellido}
            mail={studentInfo.correo}
            pfp={
              studentInfo.foto === ""
                ? "/images/pfp.svg"
                : `${API_URL}/api/uploads/${studentInfo.foto}`
            }
            suspended={studentInfo.suspendido}
            funcSuspended={handleSuspended}
            funcDelete={handleDelete}
          />
        )}
      </div>
      <h1 className={style.title}>Postulaciones del estudiante</h1>
      <div className={style.postulationsContainer}>
        {postulations.length ? (
          postulations.map((postulation) => (
            <InfoTab
              key={[postulation.id_oferta, postulation.id_postulacion]}
              title={postulation.id_oferta}
              company={postulation.id_postulacion}
              salary={postulation.estado}
              labelbutton="Ver más"
              onClick={() => {
                handleShowMore(
                  postulation.id_oferta,
                  postulation.id_postulacion
                )
              }}
            />
          ))
        ) : (
          <h1 style={{ color: "#000" }}>No hay postulaciones</h1>
        )}
      </div>
    </div>
  )
}

export default PublicProfileAdminStudent
