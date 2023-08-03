import { useState } from "react"
import { useStoreon } from "storeon/react"
import API_URL from "../api"

const useApi = () => {
  const { user } = useStoreon("user")

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleRequest = async (method, path, body = null) => {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    }
    if (method === "POST" || method === "PUT") {
      options.body = JSON.stringify(body)
    }

    if (user.token) {
      options.headers.Authorization = `Bearer ${user.token}`
    }
    console.info("API CALLL:", `${API_URL}/api${path}`, options)
    setLoading(true)
    const response = await fetch(`${API_URL}/api${path}`, options)
    const datos = await response.json() // Recibidos
    console.log("API RESPONSE:", datos.message)
    setLoading(false)
    setData(datos.data)

    if (datos.status !== 200) {
      setError(datos.message)
    }

    return datos
  }

  return {
    error,
    user,
    data,
    loading,
    handleRequest,
  }
}

export default useApi
