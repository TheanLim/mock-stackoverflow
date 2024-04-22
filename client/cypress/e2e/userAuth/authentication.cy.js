beforeEach(() => {
  cy.task('dbTeardown');
  cy.task('dbSeed');
})

describe('Login/Logout Workflow', () => {
  it('Should show sign-in button if not logged in', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").should('exist');
  });

  it('Should redirect to login page from anywhere in application if Sign In button clicked', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").should('exist');
    cy.get('.bluebtn').contains("Sign In").click()
    cy.get('.form_postBtn').contains("Login").should('exist');
    cy.get('.menu_button').contains("Tags").click()
    cy.get('.bluebtn').contains("Sign In").should('exist');
    cy.get('.bluebtn').contains("Sign In").click()
    cy.get('.form_postBtn').contains("Login").should('exist');
    cy.get('.menu_button').contains("Questions").click()
    cy.get('.postTitle').first().click();
    cy.get('.bluebtn').contains("Sign In").should('exist');
    cy.get('.bluebtn').contains("Sign In").click()
    cy.get('.form_postBtn').contains("Login").should('exist');
    cy.get('.menu_button').contains("Questions").click()
    cy.get('.postTitle').first().click();
    cy.get('.post_author').first().click();
    cy.get('.bluebtn').contains("Sign In").should('exist');
    cy.get('.bluebtn').contains("Sign In").click()
    cy.get('.form_postBtn').contains("Login").should('exist');
  });

  it('Should show sign-out and profile buttons if logged in', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").should('exist');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").should('exist');
    cy.get('.bluebtn').contains("Sign Out").should('exist');
  });

  it('Should logout user if user clicks Sign Out and require login for restricted features', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").should('exist');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Sign Out").click();
    cy.get('.bluebtn').contains("Ask a Question").click();
    cy.get('.form_postBtn').contains("Login").should('exist');
  });

  it('Should allow users to login to accounts that they created via registration', () => {
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
    cy.get('.bluebtn').contains("Sign Out").click();
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('new@email.com');
    cy.get('#formPasswordInput').type('test123');
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

  it('Should update time last seen for user when they log out', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").should('exist');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').contains('Last seen: Apr 04, 2023 at 18:20:59');
    cy.get('.bluebtn').contains("Sign Out").click();
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').contains('Last seen: Apr 04, 2023 at 18:20:59').should('not.exist');
  });

  it('Should redirect to home page if sign out pressed while on profile', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").click()
    cy.get('.info-line').first().contains("Display Name: mkrstulovic");
    cy.get('.info-line').contains("Email: test1@gmail.com");
    cy.get('.info-line').contains("Name: Marko Krstulovic");
    cy.get('.bluebtn').contains("Edit Profile").should('exist');
    cy.get('.bluebtn').contains("Sign Out").click();
    cy.get('.bold_title').contains("All Questions");
  });

  it('Should redirect to home page if sign out pressed while on edit profile', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.bluebtn').contains("Edit Profile").click();
    cy.get('.bluebtn').contains("Sign Out").click();
    cy.get('.bold_title').contains("All Questions");
  });

  it('Should redirect to home page if sign out pressed while on ask new question', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Ask a Question").click();
    cy.get('.bluebtn').contains("Sign Out").click();
    cy.get('.bold_title').contains("All Questions");
  });

  it('Should redirect to home page if sign out pressed while on question page', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').first().click();
    cy.get('.bluebtn').contains("Sign Out").click();
    cy.get('.bold_title').contains("All Questions");
  });

  it('Should redirect to home page if sign out pressed while on answer question page', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').eq(1).click();
    cy.get('.bluebtn').contains("Answer Question").click();
    cy.get('.bluebtn').contains("Sign Out").click();
    cy.get('.bold_title').contains("All Questions");
  });
});

describe('Post Ownership', () => {
  it('Should correctly attribute new questions to the logged in user', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Ask a Question").click();
    cy.get('#formTitleInput').type('Test New Title');
    cy.get('#formTextInput').type('Test New Text');
    cy.get('#formTagInput').type('react');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains('Test New Title').click();
    cy.get('.post_author').first().contains('mkrstulovic');
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').contains("Display Name: mkrstulovic");
  });

  it('Should correctly attribute new answers to the logged in user', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains('Programmatically navigate using React router').click();
    cy.get('.bluebtn').contains("Answer Question").click();
    cy.get('#answerTextInput').type('Test Answer');
    cy.get('.form_postBtn').click();
    cy.get('.postText').eq(3).contains('Test Answer');
    cy.get('.post_author').eq(3).contains('thean');
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').contains("Display Name: thean");
  });

  it('Should correctly attribute new comments to the logged in user', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').first().click();
    cy.get('.comment_button').contains("Add a comment").first().click();
    cy.get('.comment-textarea').type("Test Comment{enter}");
    cy.get('.comment_text').eq(1).contains("Test Comment");
    cy.get('.comment_author').eq(1).contains("mkrstulovic");
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').contains("Display Name: mkrstulovic");
  });
});