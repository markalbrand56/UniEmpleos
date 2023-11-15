import { StoreContext } from "storeon/react"
import store from "@store"
import React from "react"
import Page from "./pages/index"
import "./assets/fonts/fonts.css"
import "./App.css"
import LanguageButton from "./components/LanguageButton/LanguageButton"

function App() {
  return (
    <StoreContext.Provider value={store}>
      <div className="App">
        <Page />
      </div>
      <LanguageButton />
    </StoreContext.Provider>
  )
}

export default App
