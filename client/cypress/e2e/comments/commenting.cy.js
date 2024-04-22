beforeEach(() => {
  cy.task('dbTeardown');
  cy.task('dbSeed');
})

describe('Creating Comments', () => {
  const qTitle = "Programmatically navigate using React router";

  it('Should redirect to login screen and back to question page if not logged in when add comment clicked', () => {
    cy.visit('http://localhost:3000');
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.comment_button').contains('Add a comment').first().click();
    cy.get('.form_postBtn').contains("Login").should('exist');
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').contains("Login").click();
    cy.get('.bold_title').contains(qTitle);
  });

  it('Should display snackbar if logged in but not enough reputation when clicking add comment', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test6@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.comment_button').should('exist');
    cy.get('.comment_button').first().click();
    cy.wait(110)
    cy.get('.Snackbar__message', {timeout: 1}).contains("Needs at least 50 reputation to comment");
  });

  it('Should display comment text area if logged in with enough rep and add comment clicked', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.comment_button').should('exist');
    cy.get('.comment_button').first().click();
    cy.get('.comment-textarea').should('exist');
  });

  it('Should display snackbar if logged in with enough rep but comment to add is empty', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.comment_button').should('exist');
    cy.get('.comment_button').first().click();
    cy.get('.comment-textarea').type("{enter}");
    cy.wait(30)
    cy.get('.Snackbar__message', {timeout: 1}).contains("You must enter text to comment");
    cy.get('.comment-textarea').should('not.exist');
  });

  it('Should create comment if text entered and enter hit', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.comment_button').should('exist');
    cy.get('.comment_button').first().click();
    cy.get('.comment-textarea').should('exist');
    cy.get('.comment-textarea').type("Test Comment{enter}");
    cy.get('.comment_text').eq(1).contains("Test Comment");
    cy.get('.comment_text').eq(1).contains("thean");
    cy.get('.comment_meta').eq(1).contains("0 seconds ago");
  });

  it('Should display snackbar if invalid hyperlink provided', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.comment_button').should('exist');
    cy.get('.comment_button').first().click();
    cy.get('.comment-textarea').type("[](no){enter}");
    cy.wait(30)
    cy.get('.Snackbar__message', {timeout: 1}).contains("Invalid hyperlink format.");
    cy.get('.comment-textarea').should('exist');
  });

  it('Should display valid hyperlink provided', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.comment_button').should('exist');
    cy.get('.comment_button').first().click();
    cy.get('.comment-textarea').type("[Test](https://www.google.com){enter}");
    cy.get('.comment-textarea').should('not.exist');
    cy.get('.comment_text').eq(1).find("a")
      .should("have.attr", "href", "https://www.google.com");
  });

  it('Should hide comment text area if escape hit', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.comment_button').should('exist');
    cy.get('.comment_button').first().click();
    cy.get('.comment-textarea').should('exist');
    cy.get('.comment-textarea').type("{esc}");
    cy.get('.comment-textarea').should('not.exist');
  });

  it('Should retain comment text if comment text area closed and reopened', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.comment_button').should('exist');
    cy.get('.comment_button').first().click();
    cy.get('.comment-textarea').should('exist');
    cy.get('.comment-textarea').type("TEST{esc}");
    cy.get('.comment-textarea').should('not.exist');
    cy.get('.comment_button').first().click();
    cy.get('.comment-textarea').contains("TEST").should('exist');
    cy.get('.comment-textarea').type("{enter}");
    cy.get('.comment-textarea').should('not.exist');
    cy.get('.comment_text').eq(1).contains("TEST");
    cy.get('.comment_text').eq(1).contains("thean");
    cy.get('.comment_meta').eq(1).contains("0 seconds ago");
  });
});