import { createRouter } from "@storeon/router"

export default createRouter([
  ["/", () => ({ page: "home" })],
  ["/signup", () => ({ page: "signup" })],
  ["/login", () => ({ page: "login" })],
  ["/signupestudiante", () => ({ page: "signupestudiante" })],
  ["/signupempresa", () => ({ page: "signupempresa" })],
])
