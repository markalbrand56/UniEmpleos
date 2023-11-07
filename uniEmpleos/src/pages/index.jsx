import { useStoreon } from "storeon/react"
import { routerKey } from "@storeon/router"
import React from "react"
import Login from "./Login/Login"
import Signup from "./SignUp/SignUp"
import Home from "./Home/Home"
import PrincipalStudent from "./PrincipalStudent/PrincipalStudent"
import SignUpEstudiante from "./SignUpEstudiante/SignUpEstudiante"
import SignUpEmpresa from "./SignUpEmpresa/SignUpEmpresa"
import PrincipalEnterprise from "./PrincipalEnterprise/PrincipalEnterprise"
import EditProfileEstudiante from "./EditProfileEstudiantes/EditProfileEstudiante"
import EditProfileEmpresa from "./EditProfileEmpresas/EditProfileEmpresa"
import Postulacion from "./postulacion/Postulacion"
import PostulationsEmpresa from "./PostulationsEmpresa/PostulationsEmpresa"
import NewOffer from "./nuevaOferta/NewOffer"
import ChatPage from "./ChatPage/ChatPage"
import PostulationsEstudent from "./PostulationsEstudentPage/PostulationsEstudent"
import OfferDetails from "./OfferDetails/OfferDetails"
import PostulantesPage from "./PostulantesPage/PostulantesPage"
import PublicProfile from "./PublicProfile/PublicProfile"
import PrincipalAdmin from "./PricipalAdmin/PrincipalAdmin"
import AdminShowPostulationDetails from "./AdminShowPostulationDetails/AdminShowPostulationDetails"
import ProfileAdminStudent from "./AdminStudent/AdminStudent"
import PublicProfileAdminStudent from "./PublicProfileAdminStudent/PublicProfileAdminStudent"
import PublicProfileAdminEnterprise from "./PublicProfileAdminEnterprise/PublicProfileAdminEnterprise"
import AdminShowPostulationDetailsStudent from "./AdminShowPostulationDetailsStudent/AdminShowPostulationDetailsStudent"

const Page = () => {
  const { [routerKey]: route } = useStoreon(routerKey)

  let Component = null
  switch (route.match.page) {
    case "home":
      Component = <Home />
      break
    case "signup":
      Component = <Signup />
      break
    case "login":
      Component = <Login />
      break
    case "principalStudent":
      Component = <PrincipalStudent />
      break
    case "principaladmin":
      Component = <PrincipalAdmin />
      break
    case "signupestudiante":
      Component = <SignUpEstudiante />
      break
    case "signupempresa":
      Component = <SignUpEmpresa />
      break
    case "principalempresa":
      Component = <PrincipalEnterprise />
      break
    case "editprofileestudiante":
      Component = <EditProfileEstudiante />
      break
    case "editprofileempresa":
      Component = <EditProfileEmpresa />
      break
    case "postulacion":
      Component = <Postulacion id={route.match.props.id} />
      break
    case "postulacionempresa":
      Component = <PostulationsEmpresa />
      break
    case "newoffer":
      Component = <NewOffer />
      break
    case "chat":
      Component = <ChatPage />
      break
    case "postulationdetails":
      Component = <OfferDetails id={route.match.props.id} />
      break
    case "postulaciones":
      Component = <PostulationsEstudent />
      break
    case "postulantes":
      Component = <PostulantesPage id={route.match.props.id} />
      break
    case "publicprofile":
      Component = <PublicProfile params={route.match.props.params} />
      break
    case "adminShowPostulationDetails":
      Component = <AdminShowPostulationDetails id={route.match.props.id} />
      break
    case "adminStudent":
      Component = <ProfileAdminStudent />
      break
    case "publicprofileadminstudent":
      Component = <PublicProfileAdminStudent id={route.match.props.id} />
      break
    case "publicprofileadminenterprise":
      Component = <PublicProfileAdminEnterprise id={route.match.props.id} />
      break
    case "adminShowPostulationDetailsStudent":
      Component = <AdminShowPostulationDetailsStudent param={route.match.props.param} />
      break
    default:
      Component = <h1>404 Error</h1>
  }

  return <main>{Component}</main>
}

export default Page
