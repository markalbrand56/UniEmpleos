import React from "react"
import { StoreContext } from "storeon/react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import LogIn from "./pages/Login/Login"
import SignUp from "./pages/SignUp/SignUp"
import Home from "./pages/Home/Home"
import "./App.css"
import store from "./store"

function App() {
  return (
    <StoreContext.Provider value={store}>
      <Router>
        <Routes>
          <Route path="/">
            <Route index element={<h1>Home</h1>} />
            <Route path="login" element={<LogIn />} />
            <Route path="/signin" element={<h1>Sign In</h1>} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </StoreContext.Provider>
  )
}

export default App
