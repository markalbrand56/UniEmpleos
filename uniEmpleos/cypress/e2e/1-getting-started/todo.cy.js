/// <reference types="cypress" />

describe('Pruebas para la aplicación', () => {
  beforeEach(() => {
    // Visitar la página de inicio antes de cada test
    cy.visit('https://sage-palmier-936be2.netlify.app/')
  })

  it('debería mostrar los botones "Iniciar Sesión" y "Registrarse" en la página de inicio', () => {
    // Verificar que el botón "Iniciar Sesión" está presente
    cy.contains('Iniciar Sesión').should('be.visible')
    
    // Verificar que el botón "Registrarse" está presente
    cy.contains('Registrarse').should('be.visible')
  })

  it('debería navegar a la página de registro para estudiantes y mostrar los campos correspondientes', () => {
    // Hacer clic en el botón "Registrarse"
    cy.contains('Registrarse').click()

    //Hacer clic en el botón "Estudiante"
    cy.contains('Buscando empleo').click()

  })

  // Aquí puedes agregar más tests según las funcionalidades de tu aplicación.
})
