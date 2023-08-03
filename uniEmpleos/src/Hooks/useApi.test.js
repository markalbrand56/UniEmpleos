import { test, expect,it  } from 'vitest'
import useApi from './useApi'


test("useApi", () => {
  // Prueba que se llama a la función handleRequest con parámetros válidos y devuelve los datos esperados
  it("should call handleRequest with valid parameters and return expected data", async () => {
    const { handleRequest } = useApi()
    const method = "GET"
    const path = "/example"
    const body = null
    const response = await handleRequest(method, path, body)
    expect(response.status).toBe(200)
    expect(response.data).toBeDefined()
    expect(response.error).toBeNull()
    expect(response.loading).toBeFalsy()
  })
})
