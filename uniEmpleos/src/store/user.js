import { createStoreon } from "storeon"

const user = (store) => {
  store.on("@init", () => ({ user: { email: "", password: "" } }))
  store.on("user/login", (_, { email }) => ({ user: { email } }))
}

export default user
