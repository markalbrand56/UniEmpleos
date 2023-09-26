describe("Pruebas para la página de logIn", () => {
  beforeEach(() => {
    // Visitar la página de registro de estudiantes antes de cada test
    cy.visit("https://sage-palmier-936be2.netlify.app/login") // Asume que esta es la URL correcta, ajústala si es necesario.
  })

  it("deberia ingresar a la pagina principal del estudiante y ver el boton de perfil", () => {
    cy.get('input[name="correo"]').type("cas21700@uvg.edu.gt")
    cy.get('input[name="password"]').type("1809")
    cy.contains("Iniciar sesión").click()
    cy.contains("Credenciales incorrectas. Inténtelo de nuevo").should("not.exist")
    cy.wait(2000)
    cy.url().should("include", "/profile")
    cy.contains("Perfil").click()
    cy.url().should("include", "/editprofileestudiante")
  })

  it("deberia ingresar a la pagina principal del estudiante y ver el boton de chat", () => {
    cy.get('input[name="correo"]').type("cas21700@uvg.edu.gt")
    cy.get('input[name="password"]').type("1809")
    cy.contains("Iniciar sesión").click()
    cy.contains("Credenciales incorrectas. Inténtelo de nuevo").should("not.exist")
    cy.wait(2000)
    cy.url().should("include", "/profile")
    cy.contains("Chat").click()
    cy.url().should("include", "/chat")
  })

  it("deberia ingresar a la pagina principal del estudiante ver el boton de log out y salirse", () => {
    cy.get('input[name="correo"]').type("cas21700@uvg.edu.gt")
    cy.get('input[name="password"]').type("1809")
    cy.contains("Iniciar sesión").click()
    cy.contains("Credenciales incorrectas. Inténtelo de nuevo").should("not.exist")
    cy.wait(2000)
    cy.url().should("include", "/profile")
    cy.contains("Log Out").click()
    cy.url().should("include", "/login")
  })
})