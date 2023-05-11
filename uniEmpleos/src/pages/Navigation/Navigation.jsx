import React from "react"
import { StoreContext } from "storeon/react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import LogIn from "../Login/Login"
import SignUp from "../SignUp/SignUp"
import Home from "../Home/Home"
import store from "../../store"

const Navigation = () => (
  <StoreContext.Provider value={store}>
    <Router>
      <Routes>
        <Route path="/">
          <Route index element={<h1>Home</h1>} />
          <Route path="login" element={<LogIn />} />
          <Route path="home" element={<Home />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
      </Routes>
    </Router>
  </StoreContext.Provider>
)

export default Navigation
