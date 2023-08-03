import { afterEach, describe, expect, it, vi, mount } from "vitest"
import { render, fireEvent, waitFor } from "@testing-library/react"
import { StoreContext } from "storeon/react"
import React from "react"
import { routerNavigate } from "@storeon/router"
import SignUpEmpresa from "./SignUpEmpresa"
import store, { navigate } from "../../store"
import API_URL from "../../api"

it("should call API and navigate to login page when valid form data is submitted", async () => {
  const fetchSpy = vi.spyOn(window, "fetch").mockResolvedValue({
    json: () => Promise.resolve({ status: 200 }),
  })
  const navigateSpy = vi.spyOn(store, "dispatch")

  const { getByPlaceholderText, getByText } = render(
    <StoreContext.Provider value={store}>
      <SignUpEmpresa />
    </StoreContext.Provider>
  )

  fireEvent.change(getByPlaceholderText("miEmpresa.org"), {
    target: { value: "Test Company" },
  })
  fireEvent.change(getByPlaceholderText("21212413"), {
    target: { value: "12345678" },
  })
  fireEvent.change(getByPlaceholderText("empresa@org.com"), {
    target: { value: "test@test.com" },
  })
  fireEvent.change(getByPlaceholderText("miContraseña"), {
    target: { value: "testpassword" },
  })
  fireEvent.change(getByPlaceholderText("Detalles de la empresa"), {
    target: { value: "Test company details" },
  })

  // Simulate form submission
  fireEvent.click(getByText("Registrarse"))

  // Check if the correct API call was made
  expect(fetchSpy).toHaveBeenCalledWith(`${API_URL}/api/companies`, {
    method: "POST",
    body: JSON.stringify({
      nombre: "Test Company",
      detalles: "Test company details",
      correo: "test@test.com",
      telefono: "12345678",
      contra: "testpassword",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })

  // Wait for the navigation to happen
  await waitFor(() => {
    expect(navigateSpy).toHaveBeenCalledWith(routerNavigate, "/login")
  })

  // Restore the spies
  fetchSpy.mockRestore()
  navigateSpy.mockRestore()
})
