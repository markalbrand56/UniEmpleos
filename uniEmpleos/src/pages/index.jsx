import { useStoreon } from "storeon/react"
import { routerKey } from "@storeon/router"
import React from "react"
import Login from "./Login/Login"
import Signup from "./SignUp/SignUp"
import Home from "./Home/Home"
import PrincipalStudent from "./PrincipalStudent/PrincipalStudent"

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
    default:
      Component = <h1>404 Error</h1>
  }

  return <main>{Component}</main>
}

export default Page
