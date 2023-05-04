import React from "react"
import LogIn from "./pages/Login/Login"
import "./App.css"
import { StoreContext, useStoreon } from "storeon/react"
import store from "./store"
import {
  BrowserRouter as Router,
  Route,
  Link,
  useNavigate,
  Outlet,
  Routes,
} from "react-router-dom"

function App() {
  return (
    <StoreContext.Provider value={store}>
      <Router>
        <Routes>
          <Route path="/" element={<LogIn />}>
            <Route index element={<h1>Home</h1>} />
            <Route path="login" element={<LogIn />} />
            <Route path="signin" element={<h1>Sign In</h1>} />
          </Route>
        </Routes>
      </Router>
    </StoreContext.Provider>
  )
}

function Navigation() {
  const history = useHistory()

  const { user } = useStoreon("user")

  if (user.dpi == "") {
    console.log("No hay usuario")
    history.push("/login")
    return null
  }
  console.log("Hay usuario")

  return <h1>Nav</h1>
}

export default App
