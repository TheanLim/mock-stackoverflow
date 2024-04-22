beforeEach(() => {
  cy.task('dbTeardown');
  cy.task('dbSeed');
})

describe("Account Creation - Login", () => {
  it('Shows an error if either email or password inputs are empty', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('.form_postBtn').click();
    cy.get('.input_error').contains("You must enter an email.");
    cy.get('.input_error').contains("You must enter a password.");
  });

  it('Shows an error if the email entered is in an invalid format', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('aaaaaaa');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.input_error').contains("Invalid Email Format.");
  });

  it('Shows an error if the email entered is incorrect', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('unreal@email.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.input_error').contains("Invalid email or password.");
  });

  it('Shows an error if the password entered is incorrect', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('BADPASSWORD');
    cy.get('.form_postBtn').click();
    cy.get('.input_error').contains("Invalid email or password.");
  });

  it('Correctly logs in user with correct information', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").should('exist');
    cy.get('.bluebtn').contains("Sign Out").should('exist');
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').contains('Email: test1@gmail.com');
    cy.get('.info-line').contains('Display Name: mkrstulovic');
  });

  it('Correctly redirects to Register', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('.bluebtn').contains("Click to Register!").click();
    cy.get('.form_postBtn').contains("Register");
  });
});

describe("Account Creation - Register", () => {
  it('Shows an error if either email, password, display name, or any name inputs are empty', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('.bluebtn').contains("Click to Register!").click();
    cy.get('.form_postBtn').click();
    cy.get('.input_error').contains("Your email is required.");
    cy.get('.input_error').contains("Your password is required.");
    cy.get('.input_error').contains("Your display name is required.");
    cy.get('.input_error').contains("Your first name is required.");
    cy.get('.input_error').contains("Your last name is required.");
  });

  it('Shows an error if the email entered is in an invalid format', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('.bluebtn').contains("Click to Register!").click();
    cy.get('#formEmailInput').type('aaaaaaa');
    cy.get('#formPasswordInput').type('test123');
    cy.get('#formUsernameInput').type('new_display_name');
    cy.get('#formFirstNameInput').type('New');
    cy.get('#formLastNameInput').type('User');
    cy.get('.form_postBtn').click();
    cy.get('.input_error').contains("Invalid Email Format.");
  });

  it('Shows an error if the email entered already exists', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('.bluebtn').contains("Click to Register!").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('#formUsernameInput').type('new_display_name');
    cy.get('#formFirstNameInput').type('New');
    cy.get('#formLastNameInput').type('User');
    cy.get('.form_postBtn').click();
    cy.get('.input_error').contains("Email already exists");
  });

  it('Shows an error if the display name entered already exists', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('.bluebtn').contains("Click to Register!").click();
    cy.get('#formEmailInput').type('new@email.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('#formUsernameInput').type('mkrstulovic');
    cy.get('#formFirstNameInput').type('New');
    cy.get('#formLastNameInput').type('User');
    cy.get('.form_postBtn').click();
    cy.get('.input_error').contains("Display Name already exists");
  });

  it('Correctly creates a new user account when user registers', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('.bluebtn').contains("Click to Register!").click();
    cy.get('#formEmailInput').type('new@email.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('#formUsernameInput').type('new_display_name');
    cy.get('#formFirstNameInput').type('New');
    cy.get('#formLastNameInput').type('User');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").should('exist');
    cy.get('.bluebtn').contains("Sign Out").should('exist');
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').contains('Email: new@email.com');
    cy.get('.info-line').contains('Display Name: new_display_name');
    cy.get('.info-line').contains('Name: New User');
    cy.get('.info-line').contains('1 reputation earned');
    cy.get('.info-line').contains('0 questions asked');
    cy.get('.info-line').contains('0 questions answered');
  });

  it('Correctly redirects to Login', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('.bluebtn').contains("Click to Register!").click();
    cy.get('.form_postBtn').contains("Register");
    cy.get('.bluebtn').contains("Have an account? Login.").click();
    cy.get('.form_postBtn').contains("Login");
  });
});
