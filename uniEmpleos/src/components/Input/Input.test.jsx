import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"

import { vi, it, expect, userEvent} from "vitest"
import Input from "./Input"

// Renderiza el input con props 
it('debería renderizar el input con los props dados', () => {
  render(<Input name="test" type="text" placeholder="Test" />)

  expect(screen.getByLabelText('Test')).toBeInTheDocument()
})

// Llama la función onChange cuando cambia
it('debería llamar a onChange cuando el input cambia', () => {
  const onChange = vi.fn()
  render(<Input name="test" onChange={onChange} />)

  userEvent.type(screen.getByLabelText('test'), 'hola')

  expect(onChange).toHaveBeenCalled() 
})

// Renders con el valor dado
it('debería renderizar el input con el valor dado', () => {
  render(<Input name="test" value="hola" />)
  
  expect(screen.getByLabelText('test')).toHaveValue('hola')
})

// Valida el tipo de prop name 
it('debería lanzar error si no se pasa prop name', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  
  render(<Input />)

  expect(consoleError).toHaveBeenCalled()
})