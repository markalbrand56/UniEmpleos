import { createRouter } from "@storeon/router"

export default createRouter([
  ["/", () => ({ page: "home" })],
  ["/signup", () => ({ page: "signup" })],
  ["/login", () => ({ page: "login" })],
  ["/profile", () => ({ page: "principalStudent" })],
  ["/profilecompany", () => ({ page: "principalempresa" })],
  ["/profileadmin", () => ({ page: "principaladmin" })],
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
  ["/postulaciones", () => ({ page: "postulaciones" })],
  ["/postulantes/*", (id) => ({ page: "postulantes", props: { id } })],
  [
    "/publicprofile/*",
    (params) => ({ page: "publicprofile", props: { params } }),
  ],
  [
    "/adminSPD/*",
    (id) => ({ page: "adminShowPostulationDetails", props: { id } }),
  ],
  ["/profileadminstudent", () => ({ page: "adminStudent" })],
  [
    "/publicprofileadminstudent/*",
    (id) => ({ page: "publicprofileadminstudent", props: { id } }),
  ],
  [
    "/publicprofileadminenterprise/*",
    (id) => ({ page: "publicprofileadminenterprise", props: { id } }),
  ],
  [
    "/adminSPDS/*",
    (param) => ({
      page: "adminShowPostulationDetailsStudent",
      props: { param },
    }),
  ],
])
