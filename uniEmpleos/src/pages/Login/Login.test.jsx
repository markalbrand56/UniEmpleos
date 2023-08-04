import { mount, test, describe } from "vitest"
import { StoreContext } from "storeon/react"
import { store } from "../../store" // Asegúrate de importar tu store
import LogIn from "./Login"

test("LogIn component", () => {
  test("should render without crashing", () => {
    const { getByText } = mount(
      <StoreContext.Provider value={store}>
        <LogIn />
      </StoreContext.Provider>
    )

    test.expect(getByText("UniEmpleos")).toBeInTheDocument()
  })

  test("should update state when inputs change", () => {
    const { getByPlaceholderText } = mount(
      <StoreContext.Provider value={store}>
        <LogIn />
      </StoreContext.Provider>
    )

    getByPlaceholderText("uni@gmail.com").value = "test@gmail.com"
    getByPlaceholderText("micontraseña123").value = "password123"

    test
      .expect(getByPlaceholderText("uni@gmail.com").value)
      .toBe("test@gmail.com")
    test
      .expect(getByPlaceholderText("micontraseña123").value)
      .toBe("password123")
  })

  test("should display warning when login fails", async () => {
    const { getByText, getByPlaceholderText } = mount(
      <StoreContext.Provider value={store}>
        <LogIn />
      </StoreContext.Provider>
    )

    getByPlaceholderText("uni@gmail.com").value = "test@gmail.com"
    getByPlaceholderText("micontraseña123").value = "wrongpassword"
    getByText("Iniciar sesión").click()

    await test.waitFor(() => {
      test
        .expect(getByText("Credenciales incorrectas. Inténtelo de nuevo"))
        .toBeInTheDocument()
    })
  })
})
