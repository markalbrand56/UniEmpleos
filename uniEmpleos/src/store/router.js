import { createRouter } from "@storeon/router"

export default createRouter([
  ["/", () => ({ page: "home" })],
  ["/signup", () => ({ page: "signup" })],
  ["/login", () => ({ page: "login" })],
  ["/profile", () => ({ page: "principalStudent" })],
  ["/profilecompany", () => ({ page: "principalempresa" })],
  ["/signupestudiante", () => ({ page: "signupestudiante" })],
  ["/signupempresa", () => ({ page: "signupempresa" })],
  ["/editprofileestudiante", () => ({ page: "editprofileestudiante" })],
  ["/editprofileempresa", () => ({ page: "editprofileempresa" })],
  ["/postulacion", () => ({ page: "postulacion" })],
  ["/newoffer", () => ({ page: "newoffer" })],
  ["/postulacionempresa", () => ({ page: "postulacionempresa" })],
])
