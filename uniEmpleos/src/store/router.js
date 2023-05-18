import { createRouter } from "@storeon/router"

export default createRouter([
  ["/", () => ({ page: "home" })],
  ["/signup", () => ({ page: "signup" })],
  ["/login", () => ({ page: "login" })],
  ["/profile", () => ({ page: "principalStudent" })],
  ["/profilecompany", () => ({ page: "principalempresa" })],
  ["/signupestudiante", () => ({ page: "signupestudiante" })],
  ["/signupempresa", () => ({ page: "signupempresa" })],
])
