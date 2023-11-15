import { afterEach, describe, expect, it, vi, mount } from "vitest"
import { render, fireEvent, waitFor } from "@testing-library/react"
import { StoreContext } from "storeon/react"
import React from "react"
import { routerNavigate } from "@storeon/router"
import fetch from "node-fetch"
import SignUpEmpresa from "./SignUpEmpresa"
import store, { navigate } from "../../store"
import API_URL from "../../api"
import useApi from "../../Hooks/useApi"

global.fetch = fetch

it("should call API and navigate to login page when valid form data is submitted", async () => {
  // const api = useApi()
  const fetchSpy = vi.spyOn(window, "fetch").mockResolvedValue({
    json: () => Promise.resolve({ status: 200, data: { token: "123" } }),
  })
  const navigateSpy = vi.spyOn(store, "dispatch")

  const { getByPlaceholderText, getByTestId } = render(
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
  fireEvent.change(getByPlaceholderText("micontraseña123"), {
    target: { value: "testpassword" },
  })
  fireEvent.change(getByPlaceholderText("Detalles de la empresa"), {
    target: { value: "Test company details" },
  })

  fireEvent.click(getByTestId("signup-button"))
})
