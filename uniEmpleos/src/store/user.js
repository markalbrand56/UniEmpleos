// src/store/user.js
import { createStoreon } from "storeon"

const userModule = (store) => {
  store.on("@init", () => ({ user: { isLoggedIn: false, data: null } }))

  store.on("user/login", (state, user) => ({
    user: { isLoggedIn: true, data: user },
  }))

  store.on("user/logout", () => ({ user: { isLoggedIn: false, data: null } }))
}

const store = createStoreon([userModule])

export default store
