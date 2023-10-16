import React, { useEffect, useState } from "react"
import Header from "../../components/Header/Header"
import style from "./AdminStudent.module.css"
import InfoStudent from "../../components/InfoStudent/InfoStudent"
import useApi from "../../Hooks/useApi"
import Popup from "../../components/Popup/Popup"
import Loader from "../../components/Loader/Loader"
import fotoPFP from "/images/pfp.svg"
import API_URL from "../../api"

const ProfileAdminStudent = () => {
  const students = useApi()
  const [studentsData, setStudentsData] = useState([])
  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")
  const [typeError, setTypeError] = useState(1)
  const [loading, setLoading] = useState(false)

  const obtainStudents = async () => {
    setLoading(true)
    const data = await students.handleRequest("GET", "/admins/students")
    if (data.status === 200) {
      setStudentsData(data.data)
    } else {
      setTypeError(1)
      setError("Ups, algo salio mal al obtener los estudiantes")
      setWarning(true)
    }
    setLoading(false)
  }
  const handleStudentClick = (e) => {
    console.log(e)
  }

  useEffect(() => {
    obtainStudents()
  }, [])

  console.log(studentsData.studets)
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
        <div className={style.studentsContainer}>
          {studentsData.studets ? (
            studentsData.studets.map((student) => (
              <InfoStudent
                key={student.id_estudiante}
                nombre={student.nombre}
                apellido={student.apellido}
                pfp={
                  student.foto === ""
                    ? fotoPFP
                    : `${API_URL}/api/uploads/${student.foto}`
                }
                onClick={() => {
                  handleStudentClick(student.id_estudiante)
                }}
                showState
                state={student.suspendido}
              />
            ))
          ) : (
            <h1>No hay estudiantes</h1>
          )}
        </div>
      )}
    </div>
  )
}

export default ProfileAdminStudent
