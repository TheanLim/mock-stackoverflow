beforeEach(() => {
  cy.task('dbTeardown');
  cy.task('dbSeed');
})

describe('Editing Profiles', () => {
  it('Should redirect to edit profile and autofill information when hitting edit profile from logged in profile', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.bluebtn').contains("Edit Profile").should('exist');
    cy.get('.bluebtn').contains("Edit Profile").click();
    cy.get('.form_postBtn').contains("Update Profile");
    cy.get('#formDisplayNameInput').should('have.value','mkrstulovic');
    cy.get('#formEmailInput').should('have.value','test1@gmail.com');
    cy.get('#formAboutText').should('have.value',"I AM A CODER. I LOVE CODE.");
    cy.get('#formFNameInput').should('have.value','Marko');
    cy.get('#formLNameInput').should('have.value','Krstulovic');
  });

  it('Should not make changes/throw errors and should redirect to Profile if update profile clicked and no changes made', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.bluebtn').contains("Edit Profile").should('exist');
    cy.get('.bluebtn').contains("Edit Profile").click();
    cy.get('.form_postBtn').contains("Update Profile");
    cy.get('#formDisplayNameInput').should('have.value','mkrstulovic');
    cy.get('#formEmailInput').should('have.value','test1@gmail.com');
    cy.get('#formAboutText').should('have.value',"I AM A CODER. I LOVE CODE.");
    cy.get('#formFNameInput').should('have.value','Marko');
    cy.get('#formLNameInput').should('have.value','Krstulovic');
    cy.get('.form_postBtn').click();
    cy.get('.info-line').first().contains("Display Name: mkrstulovic");
    cy.get('.info-line').contains("Joined: Apr 03, 2023 at 18:20:59");
    cy.get('.info-line').contains("Last seen: Apr 04, 2023 at 18:20:59");
    cy.get('.info-line').contains("Email: test1@gmail.com");
    cy.get('.info-line').contains("Name: Marko Krstulovic");
    cy.get('.info-line').contains("40000 reputation earned");
    cy.get('.info-line').contains("1 questions asked");
    cy.get('.info-line').contains("2 questions answered");
    cy.get('.about-summary').contains("I AM A CODER. I LOVE CODE.");
  });

  it('Should redirect to edit profile and autofill information when hitting edit profile from logged in profile', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.bluebtn').contains("Edit Profile").should('exist');
    cy.get('.bluebtn').contains("Edit Profile").click();
    cy.get('.form_postBtn').contains("Update Profile");
    cy.get('#formDisplayNameInput').should('have.value','mkrstulovic');
    cy.get('#formEmailInput').should('have.value','test1@gmail.com');
    cy.get('#formAboutText').should('have.value',"I AM A CODER. I LOVE CODE.");
    cy.get('#formFNameInput').should('have.value','Marko');
    cy.get('#formLNameInput').should('have.value','Krstulovic');
  });

  it('Should should not make changes if moving away from edit profile page after changing fields', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.bluebtn').contains("Edit Profile").should('exist');
    cy.get('.bluebtn').contains("Edit Profile").click();
    cy.get('.form_postBtn').contains("Update Profile");
    cy.get('#formDisplayNameInput').should('have.value','mkrstulovic');
    cy.get('#formEmailInput').should('have.value','test1@gmail.com');
    cy.get('#formAboutText').should('have.value',"I AM A CODER. I LOVE CODE.");
    cy.get('#formFNameInput').should('have.value','Marko');
    cy.get('#formLNameInput').should('have.value','Krstulovic');
    cy.get('#formDisplayNameInput').type('ADDITIONAL');
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').first()
      .contains("Display Name: mkrstulovicADDITIONAL").should('not.exist');
  });


  it('Should throw error if required inputs made empty', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.bluebtn').contains("Edit Profile").should('exist');
    cy.get('.bluebtn').contains("Edit Profile").click();
    cy.get('.form_postBtn').contains("Update Profile");
    cy.get('#formDisplayNameInput').should('have.value','mkrstulovic');
    cy.get('#formEmailInput').should('have.value','test1@gmail.com');
    cy.get('#formAboutText').should('have.value',"I AM A CODER. I LOVE CODE.");
    cy.get('#formFNameInput').should('have.value','Marko');
    cy.get('#formLNameInput').should('have.value','Krstulovic');

    //Delete all required inputs:
    cy.get('#formDisplayNameInput').type('{selectall}{backspace}');
    cy.get('#formEmailInput').type('{selectall}{backspace}');
    cy.get('#formFNameInput').type('{selectall}{backspace}');
    cy.get('#formLNameInput').type('{selectall}{backspace}');
    cy.get('.form_postBtn').click();
    cy.get('.input_error').contains("Your email is required.");
    cy.get('.input_error').contains("Your display name is required.");
    cy.get('.input_error').contains("Your first name is required.");
    cy.get('.input_error').contains("Your last name is required.");
  });

  it('Should throw error if email is invalid format', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.bluebtn').contains("Edit Profile").should('exist');
    cy.get('.bluebtn').contains("Edit Profile").click();
    cy.get('.form_postBtn').contains("Update Profile");
    cy.get('#formDisplayNameInput').should('have.value','mkrstulovic');
    cy.get('#formEmailInput').should('have.value','test1@gmail.com');
    cy.get('#formAboutText').should('have.value',"I AM A CODER. I LOVE CODE.");
    cy.get('#formFNameInput').should('have.value','Marko');
    cy.get('#formLNameInput').should('have.value','Krstulovic');

    cy.get('#formEmailInput').type('{selectall}{backspace}aaaaaaaaaa');
    cy.get('.form_postBtn').click();
    cy.get('.input_error').contains("Invalid Email Format.");
  });

  it('Should throw error if about section is longer than 500 characters', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.bluebtn').contains("Edit Profile").should('exist');
    cy.get('.bluebtn').contains("Edit Profile").click();
    cy.get('.form_postBtn').contains("Update Profile");
    cy.get('#formDisplayNameInput').should('have.value','mkrstulovic');
    cy.get('#formEmailInput').should('have.value','test1@gmail.com');
    cy.get('#formAboutText').should('have.value',"I AM A CODER. I LOVE CODE.");
    cy.get('#formFNameInput').should('have.value','Marko');
    cy.get('#formLNameInput').should('have.value','Krstulovic');

    cy.get('#formAboutText').type('{selectall}{backspace}');
    cy.get('#formAboutText').type('a'.repeat(501));
    cy.get('.form_postBtn').click();
    cy.get('.input_error').contains("Limit about section to 500 characters or less.");
  });

  it('Should throw error if new email already exists', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.bluebtn').contains("Edit Profile").should('exist');
    cy.get('.bluebtn').contains("Edit Profile").click();
    cy.get('.form_postBtn').contains("Update Profile");
    cy.get('#formDisplayNameInput').should('have.value','mkrstulovic');
    cy.get('#formEmailInput').should('have.value','test1@gmail.com');
    cy.get('#formAboutText').should('have.value',"I AM A CODER. I LOVE CODE.");
    cy.get('#formFNameInput').should('have.value','Marko');
    cy.get('#formLNameInput').should('have.value','Krstulovic');

    cy.get('#formEmailInput').type('{selectall}{backspace}');
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('.form_postBtn').click();
    cy.get('.input_error').contains("New email already exists");
  });

  it('Should throw error if new display name already exists', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.bluebtn').contains("Edit Profile").should('exist');
    cy.get('.bluebtn').contains("Edit Profile").click();
    cy.get('.form_postBtn').contains("Update Profile");
    cy.get('#formDisplayNameInput').should('have.value','mkrstulovic');
    cy.get('#formEmailInput').should('have.value','test1@gmail.com');
    cy.get('#formAboutText').should('have.value',"I AM A CODER. I LOVE CODE.");
    cy.get('#formFNameInput').should('have.value','Marko');
    cy.get('#formLNameInput').should('have.value','Krstulovic');

    //Delete all required inputs:
    cy.get('#formDisplayNameInput').type('{selectall}{backspace}');
    cy.get('#formDisplayNameInput').type('thean');
    cy.get('.form_postBtn').click();
    cy.get('.input_error').contains("New Display Name already exists");
  });

  it('Should update all fields', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.bluebtn').contains("Edit Profile").should('exist');
    cy.get('.bluebtn').contains("Edit Profile").click();
    cy.get('.form_postBtn').contains("Update Profile");
    cy.get('#formDisplayNameInput').should('have.value','mkrstulovic');
    cy.get('#formEmailInput').should('have.value','test1@gmail.com');
    cy.get('#formAboutText').should('have.value',"I AM A CODER. I LOVE CODE.");
    cy.get('#formFNameInput').should('have.value','Marko');
    cy.get('#formLNameInput').should('have.value','Krstulovic');

    //Change all inputs:
    cy.get('#formDisplayNameInput').type('{selectall}{backspace}');
    cy.get('#formDisplayNameInput').type('marko');
    cy.get('#formEmailInput').type('{selectall}{backspace}');
    cy.get('#formEmailInput').type('new@email.com');
    cy.get('#formAboutText').type('{selectall}{backspace}');
    cy.get('#formAboutText').type('CODING IS FUN.');
    cy.get('#formFNameInput').type('{selectall}{backspace}');
    cy.get('#formFNameInput').type('Not');
    cy.get('#formLNameInput').type('{selectall}{backspace}');
    cy.get('#formLNameInput').type('Marko');
    cy.get('.form_postBtn').click();
    cy.get('.info-line').first().contains("Display Name: marko");
    cy.get('.info-line').contains("Joined: Apr 03, 2023 at 18:20:59");
    cy.get('.info-line').contains("Last seen: Apr 04, 2023 at 18:20:59");
    cy.get('.info-line').contains("Email: new@email.com");
    cy.get('.info-line').contains("Name: Not Marko");
    cy.get('.info-line').contains("40000 reputation earned");
    cy.get('.info-line').contains("1 questions asked");
    cy.get('.info-line').contains("2 questions answered");
    cy.get('.about-summary').contains("CODING IS FUN.");
  });

  it('Should handle hyperlinks in the about section', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.bluebtn').contains("Edit Profile").should('exist');
    cy.get('.bluebtn').contains("Edit Profile").click();
    cy.get('.form_postBtn').contains("Update Profile");
    cy.get('#formDisplayNameInput').should('have.value','mkrstulovic');
    cy.get('#formEmailInput').should('have.value','test1@gmail.com');
    cy.get('#formAboutText').should('have.value',"I AM A CODER. I LOVE CODE.");
    cy.get('#formFNameInput').should('have.value','Marko');
    cy.get('#formLNameInput').should('have.value','Krstulovic');

    cy.get('#formAboutText').type('{selectall}{backspace}');
    cy.get('#formAboutText').type('[Test](https://www.google.com)');
    cy.get('.form_postBtn').click();
    cy.get(".about-summary")
      .find("a")
      .should("have.attr", "href", "https://www.google.com");
  });

  it('Should verify hyperlinks and validate failures showing error', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.bluebtn').contains("Edit Profile").should('exist');
    cy.get('.bluebtn').contains("Edit Profile").click();
    cy.get('.form_postBtn').contains("Update Profile");
    cy.get('#formDisplayNameInput').should('have.value','mkrstulovic');
    cy.get('#formEmailInput').should('have.value','test1@gmail.com');
    cy.get('#formAboutText').should('have.value',"I AM A CODER. I LOVE CODE.");
    cy.get('#formFNameInput').should('have.value','Marko');
    cy.get('#formLNameInput').should('have.value','Krstulovic');

    cy.get('#formAboutText').type('{selectall}{backspace}');
    cy.get('#formAboutText').type("Check this invalid link: [](https://wrong.url)");
    cy.get('.form_postBtn').click();
    cy.get('.input_error').contains("Invalid hyperlink format.");
  });
});
