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
  ["/postulacion/*", (id) => ({ page: "postulacion", props: { id } })],
  ["/newoffer", () => ({ page: "newoffer" })],
  ["/postulacionempresa", () => ({ page: "postulacionempresa" })],
  ["/chat", () => ({ page: "chat" })],
  ["/chatstudents", () => ({ page: "chatstudents" })],
  [
    "/postulationdetails/*",
    (id) => ({ page: "postulationdetails", props: { id } }),
  ],
])
