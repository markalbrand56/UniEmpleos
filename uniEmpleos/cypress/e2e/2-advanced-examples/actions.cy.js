describe("Pruebas para la página de registro de estudiantes", () => {
  beforeEach(() => {
    // Visitar la página de registro de estudiantes antes de cada test
    cy.visit("https://sage-palmier-936be2.netlify.app/signupestudiante") // Asume que esta es la URL correcta, ajústala si es necesario.
  })

  it("debería mostrar todos los campos de registro para estudiantes", () => {
    // Verificar la presencia de campos en la página de registro
    cy.get('input[name="nombres"]').should("be.visible")
    cy.get('input[name="apellidos"]').should("be.visible")
    cy.get('input[name="fechaNacimiento"]').should("be.visible")
    cy.get('input[name="dpi"]').should("be.visible")
    cy.get('input[name="telefono"]').should("be.visible")
    cy.get('input[name="correo"]').should("be.visible")
    cy.get('input[name="password"]').should("be.visible")
    cy.get('input[name="universidad"]').scrollIntoView()
    cy.contains("Universidad").should("be.visible")
    cy.contains("Semestre").should("be.visible")
    cy.contains("Foto de perfil").should("be.visible")
  })

  it('debería permitir interactuar con el botón "Registrarse"', () => {
    // Asegurarse de que se pueda hacer clic en el botón "Registrarse"
    cy.contains("Registrarse").click()
    // Puedes agregar más verificaciones después del clic, dependiendo de lo que suceda después de hacer clic en el botón.
  })

  it("debería permitir interactuar con el botón de subir foto", () => {
    // Asegurarse de que se pueda hacer clic en el botón "Subir foto"
    cy.contains("Foto de perfil").click()
    // Puedes agregar más verificaciones después del clic, dependiendo de lo que suceda después de hacer clic en el botón.
  })

  it("debería permitir ingresar datos en los campos de registro", () => {
    // Ingresar datos en los campos de registro
    cy.get('input[name="nombres"]').type("Juan Carlos")
    cy.get('input[name="apellidos"]').type("Lopez Peralta")
    cy.get('input[name="fechaNacimiento"]').type("2000-01-10")
    cy.get('input[name="dpi"]').type("1234567890404")
    cy.get('input[name="telefono"]').type("12345678")
    cy.get('input[name="correo"]').type("juanperez20@gmail.com")
    cy.get('input[name="password"]').type("12345678")
    cy.get('input[name="universidad"]').type("Universidad del Valle de Guatemala")
    cy.get('select[name="carrera"]').eq(0).select("1")
    cy.get('select[name="semester"]').eq(0).select("1")

    //ingresar en el boton signup
    cy.contains("Registrarse").click()

  }
  )
})
