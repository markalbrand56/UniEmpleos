import React, { useEffect, useState } from "react"
import Select from "react-select"
import style from "./SignUpEstudiante.module.css"
import ComponentInput from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import { navigate } from "../../store"
import API_URL from "../../api"
import Popup from "../../components/Popup/Popup"
import useApi from "../../Hooks/useApi"
import { useStoreon } from "storeon/react"
import InputFile from "../../components/InputFile/InputFile"
import { AiOutlineCloudDownload } from "react-icons/ai"
import { TbEdit } from "react-icons/tb"
import Loader from "../../components/Loader/Loader"
import { useTranslation } from "react-i18next"

const SignUpEstudiante = () => {
  const { dispatch } = useStoreon("user")
  const { user } = useStoreon("user")
  const api = useApi()
  const apiCv = useApi()
  const apiPfp = useApi()
  const { t } = useTranslation()

  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [edad, setEdad] = useState("")
  const [dpi, setDpi] = useState("")
  const [correo, setCorreo] = useState("")
  const [password, setPassword] = useState("")
  const [carrera, setCarrera] = useState("")
  const [carreraId, setCarreraId] = useState(1)
  const [universidad, setUniversidad] = useState("")
  const [telefono, setTelefono] = useState("")
  const [semestre, setSemestre] = useState("1")
  const [warning, setWarning] = useState(false)
  const [error, setError] = useState("")

  const [carreras, setCarreras] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [typeError, setTypeError] = useState(1)

  const [pfp, setPfp] = useState("")
  const [pfpText, setPfpText] = useState("")
  const [pfpPreview, setPfpPreview] = useState("/images/pfp.svg")
  const [cv, setCv] = useState()
  const [cvText, setCvText] = useState("")
  const [oldCV, setOldCV] = useState("")
  const [newCV, setNewCV] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const semestres = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
  ]

  const obtainCarreras = async () => {
    const response = await fetch(`${API_URL}/api/careers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const datos = await response.json()

    if (datos.status === 200) {
      const dataCarreras = datos.data.careers.map((e) => ({
        value: e.id_carrera.toString(),
        label: e.nombre,
      }))
      setCarreras(dataCarreras)
    }
  }

  useEffect(() => {
    obtainCarreras()
  }, [])

  const handleInputsValue = (e) => {
    switch (e.target.name) {
      case "nombres":
        setNombre(e.target.value)
        break
      case "apellidos":
        setApellido(e.target.value)
        break
      case "fechaNacimiento":
        setEdad(e.target.value)
        break
      case "dpi":
        if (e.target.value.length < 14) {
          setDpi(e.target.value)
        }
        break
      case "correo":
        setCorreo(e.target.value)
        break
      case "password":
        setPassword(e.target.value)
        break
      case "carrera":
        setCarrera(e.target.value)
        break
      case "telefono":
        if (e.target.value.length < 9) {
          setTelefono(e.target.value)
        }
        break
      case "universidad":
        setUniversidad(e.target.value)
        break
      default:
        break
    }
  }

  const handleTypeSelect = (e) => {
    setCarrera(e.label)
    setCarreraId(parseInt(e.value, 10))
  }

  const handleSemestre = (e) => {
    setSemestre(e.value)
  }

  const handlePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleSignUp = async () => {
    if (
      dpi === "" ||
      nombre === "" ||
      apellido === "" ||
      edad === "" ||
      correo === "" ||
      telefono === "" ||
      carrera === "" ||
      semestre === "" ||
      password === "" ||
      universidad === ""
    ) {
      setTypeError(1)
      setError(t("signUpStudent.popUp.error1"))
      setWarning(true)
    } else if (telefono.length < 8) {
      setTypeError(1)
      setError(t("signUpStudent.popUp.error2"))
      setWarning(true)
    } else {
      setIsLoading(true)
      const apiResponse = await api.handleRequest("POST", "/students", {
        dpi,
        nombre,
        apellido,
        nacimiento: edad,
        correo,
        telefono,
        carrera: carreraId,
        semestre: parseInt(semestre, 10),
        cv: "",
        foto: "",
        contra: password,
        universidad,
      })
      if (apiResponse.status === 200) {
        const { token } = apiResponse.data
        dispatch("user/config", {
          token,
        })

        const usuario = await user.token
        console.log(usuario)

        if (cv) {
          const data = await apiCv.updateCV(cv)
          if (data.status === 200) {
            console.log("CV actualizado")
          } else {
            setTypeError(2)
            setError(t("signUpStudent.popUp.error3"))
            setWarning(true)
          }
        }
        if (pfp) {
          const data = await apiPfp.updateProfilePicture(pfp)
          if (data.status === 200) {
            console.log("Foto actualizada")
          } else {
            setTypeError(2)
            setError(t("signUpStudent.popUp.error4"))
            setWarning(true)
          }
        }
        
        setTypeError(3)
        setError(t("signUpStudent.popUp.error5"))
        setWarning(true)
        setTimeout(() => {
          setIsLoading(false)
          navigate("/login")
        }, 5000)
      } else if (apiResponse.status === 409) {
        setTypeError(2)
        setError(t("signUpStudent.popUp.error6"))
        setWarning(true)
      } else {
        setTypeError(1)
        setError(t("signUpStudent.popUp.error7"))
        setWarning(true)
      }
    }
  }

  const handleImageSelect = (event) => {
    const selectedFile = event.target.files[0]
    if (
      selectedFile &&
      (selectedFile.type === "image/png" ||
        selectedFile.type === "image/jpeg" ||
        selectedFile.type === "image/jpg")
    ) {
      setPfpText(selectedFile.name)
      setPfp(selectedFile)
      setPfpPreview(URL.createObjectURL(selectedFile))
    } else {
      setTypeError(2)
      setError(t("signUpStudent.popUp.error8"))
      setWarning(true)
    }
  }

  const handleCVSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setCvText(selectedFile.name)
      setCv(selectedFile)
      setNewCV(URL.createObjectURL(selectedFile))
    } else {
      setTypeError(2)
      setError(t("signUpStudent.popUp.error9"))
      setWarning(true)
    }
  }

  const handleShowCV = () => {
    if (newCV !== "") {
      window.open(newCV)
    } else {
      if (oldCV === "") {
        setTypeError(2)
        setError(t("signUpStudent.popUp.error10"))
        setWarning(true)
      } else {
        window.open(`${API_URL}/api/cv/${oldCV}`)
      }
    }
  }

  return (
    <div className={style.signUpCointainer}>
      <Popup
        message={error}
        status={warning}
        style={typeError}
        close={() => setWarning(false)}
      />
      {isLoading ? (
        <div className={style.loaderContainer}>
          <Loader size={100} />
        </div>
      ) : (
        <div className={style.mainContainer}>
          <div className={style.imgContainer}>
            <img src={pfpPreview} alt="profile picture" />
            <div className={style.editImageContainer}>
              <label>
                <TbEdit size={25} color="#fff" className={style.imageSvg} />
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  className={style.inputImage}
                  style={{ display: "none" }}
                  onChange={handleImageSelect}
                />
              </label>
            </div>
          </div>
          <div className={style.dataContainer}>
            <div className={style.dataGroup1Container}>
              <div className={style.cvContainer}>
                <span className={style.titleCV}>{t("signUpStudent.page.cv")}</span>
                <InputFile
                  file={cvText}
                  placeHolder={t("signUpStudent.page.placeHolderCv")}
                  onFileSelect={handleCVSelect}
                  type="pdf"
                />
                <AiOutlineCloudDownload
                  size={20}
                  color="#000"
                  className={style.cvSvg}
                  onClick={handleShowCV}
                />
              </div>
              <div className={style.nameContainer}>
                <span>{t("signUpStudent.page.names")}</span>
                <ComponentInput
                  name="nombres"
                  type="text"
                  placeholder="Juan"
                  onChange={handleInputsValue}
                />
              </div>
              <div className={style.lastNameContainer}>
                <span>{t("signUpStudent.page.lastNames")}</span>
                <ComponentInput
                  name="apellidos"
                  type="text"
                  placeholder="Heredia"
                  onChange={handleInputsValue}
                />
              </div>
              <div className={style.birthDateContainer}>
                <span>{t("signUpStudent.page.dateBirth")}</span>
                <ComponentInput
                  name="fechaNacimiento"
                  type="date"
                  placeholder="2018-07-22"
                  min="1940-01-01"
                  max="2005-01-01"
                  onChange={handleInputsValue}
                />
              </div>
            </div>
            <div className={style.dataGroup2Container}>
              <div className={style.dpiContainer}>
                <span>{t("signUpStudent.page.DPI")}</span>
                <ComponentInput
                  value={dpi}
                  name="dpi"
                  type="number"
                  placeholder="3131480580502"
                  onChange={handleInputsValue}
                />
              </div>
              <div className={style.phoneContainer}>
                <span>{t("signUpStudent.page.phone")}</span>
                <ComponentInput
                  value={telefono}
                  name="telefono"
                  type="number"
                  placeholder="34325456"
                  onChange={handleInputsValue}
                />
              </div>
              <div className={style.emailContainer}>
                <span>{t("signUpStudent.page.email")}</span>
                <ComponentInput
                  name="correo"
                  type="text"
                  placeholder="uni@uni.com"
                  onChange={handleInputsValue}
                />
              </div>
              <div className={style.passwordContainer}>
                <span>{t("signUpStudent.page.password")}</span>
                <ComponentInput
                  name="password"
                  type="password"
                  placeholder="micontraseña123"
                  onChange={handleInputsValue}
                  eye
                  onClickButton={handlePassword}
                  isOpen={showPassword}
                />
              </div>
              <div className={style.careerContainer}>
                <span>{t("signUpStudent.page.career")}</span>
                <Select
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused ? "#a08ae5" : "grey",
                      color: "black",
                    }),
                    option: (baseStyles) => ({
                      ...baseStyles,
                      color: "black",
                    }),
                  }}
                  name="carrera"
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#94bd0f",
                      primary: "#a08ae5",
                    },
                  })}
                  defaultValue={carrera}
                  options={carreras}
                  formatGroupLabel={carreras}
                  value={carreras.find((option) => option.label === carrera)}
                  onChange={handleTypeSelect}
                />
              </div>
              <div className={style.universityContainer}>
                <span>{t("signUpStudent.page.university")}</span>
                <ComponentInput
                  name="universidad"
                  type="text"
                  placeholder="Universidad de San Carlos"
                  onChange={handleInputsValue}
                />
              </div>
              <div className={style.semesterContainer}>
                <span className={style.titleSemester}>{t("signUpStudent.page.semester")}</span>
                <Select
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused ? "#a08ae5" : "grey",
                      color: "black",
                    }),
                    option: (baseStyles) => ({
                      ...baseStyles,
                      color: "black",
                    }),
                  }}
                  name="carrera"
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#94bd0f",
                      primary: "#a08ae5",
                    },
                  })}
                  defaultValue={semestre}
                  options={semestres}
                  formatGroupLabel={semestres}
                  value={semestres.find((option) => option.label === semestre)}
                  onChange={handleSemestre}
                />
              </div>
            </div>
            <div className={style.buttonContainer}>
              <Button label={t("signUpStudent.page.register")} onClick={handleSignUp} />
            </div>
          </div>
        </div>
      )}
      <div className={style.backgroundSVGContainer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className={style.backgroundSVG}
        >
          <path
            fill="#B0E212"
            fillOpacity="1"
            d="M0,96L60,133.3C120,171,240,245,360,272C480,299,600,277,720,240C840,203,960,149,1080,
          122.7C1200,96,1320,96,1380,96L1440,96L1440,320L1380,320C1320,320,1200,320,1080,
          320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  )
}

export default SignUpEstudiante
