import http from "k6/http"
import { sleep, check } from "k6"

export const options = {
  scenarios: {
    low_load: {
      executor: "constant-vus",
      vus: 100,
      duration: "1m", // por ejemplo, 1 minuto
      gracefulStop: "30s",
    },
    medium_load: {
      executor: "constant-vus",
      vus: 200,
      duration: "1m", // por ejemplo, 1 minuto
      startTime: "2m", // inicia después de que el primer escenario ha terminado
      gracefulStop: "30s",
    },
    high_load: {
      executor: "constant-vus",
      vus: 400,
      duration: "1m", // por ejemplo, 1 minuto
      startTime: "3m", // inicia después de que el segundo escenario ha terminado
      gracefulStop: "30s",
    },
  },
}

function login() {
  const res = http.get("https://sage-palmier-936be2.netlify.app/login")
  check(res, { "status was 200": (r) => r.status === 200 })
}

function signup() {
  const res = http.get("https://sage-palmier-936be2.netlify.app/signup")
  check(res, { "status was 200": (r) => r.status === 200 })
}

function homepage() {
  const res = http.get("https://sage-palmier-936be2.netlify.app/")
  check(res, { "status was 200": (r) => r.status === 200 })
}

export default function () {
  // Genera un número aleatorio entre 1 y 3
  const randomPage = Math.floor(Math.random() * 3) + 1

  switch (randomPage) {
    case 1:
      login()
      break
    case 2:
      signup()
      break
    case 3:
      homepage()
      break
    default:
      homepage()
      break
  }

  sleep(1)
}
