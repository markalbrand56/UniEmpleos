describe("Pruebas para la página de logIn", () => {
  beforeEach(() => {
    // Visitar la página de registro de estudiantes antes de cada test
    cy.visit("https://sage-palmier-936be2.netlify.app/login") // Asume que esta es la URL correcta, ajústala si es necesario.
  })

  it("debería mostrar todos los campos de logIn", () => {
    // Verificar la presencia de campos en la página de registro
    cy.get('input[name="correo"]').should("be.visible")
    cy.get('input[name="password"]').should("be.visible")
  })

  it('debería permitir interactuar con el botón "Iniciar sesión" y mostrar el popUp con el error', () => {
    // Asegurarse de que se pueda hacer clic en el botón "Registrarse"
    cy.contains("Iniciar sesión").click()
    // Puedes agregar más verificaciones después del clic, dependiendo de lo que suceda después de hacer clic en el botón.
    // Deberia dar error ya que no se ha llenado ningun campo
    cy.contains("Credenciales incorrectas. Inténtelo de nuevo").should("be.visible")
  })

  it("debería permitir ingresar datos en los campos de registro", () => {
    // Ingresar datos en los campos de registro
    cy.get('input[name="correo"]').type("baeimej@gmail.com")
    cy.get('input[name="password"]').type("12345678")
  })

  it("deberia permitir hacer el logIn", () => {
    cy.get('input[name="correo"]').type("cas21700@uvg.edu.gt")
    cy.get('input[name="password"]').type("1809")
    cy.contains("Iniciar sesión").click()
    cy.contains("Credenciales incorrectas. Inténtelo de nuevo").should("not.exist")
    cy.url().should("include", "/profile")
  })
})