beforeEach(() => {
  cy.task('dbTeardown');
  cy.task('dbSeed');
})

describe('Tagging Questions', () => {
  it('Should show error when no tags associated', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Tags').click();
    cy.contains('7 Tags');
    cy.contains('Ask a Question').click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('#formTitleInput').type('New Question');
    cy.get('#formTextInput').type('New Question Text');
    cy.get('.form_postBtn').click();
    cy.get('.input_error').contains("Should have at least 1 tag");
  });

  it('Should show error over 5 unique tags associated', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Tags').click();
    cy.contains('7 Tags');
    cy.contains('Ask a Question').click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('#formTitleInput').type('New Question');
    cy.get('#formTextInput').type('New Question Text');
    cy.get('#formTagInput').type('tag1 tag2 tag3 tag4 tag5 tag6');
    cy.get('.form_postBtn').click();
    cy.get('.input_error').contains("Cannot have more than 5 tags");
  });

  it('Should show error if new tags associated without enough rep to create new tags', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Tags').click();
    cy.contains('7 Tags');
    cy.contains('Ask a Question').click();
    cy.get('#formEmailInput').type('test6@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('#formTitleInput').type('New Question');
    cy.get('#formTextInput').type('New Question Text');
    cy.get('#formTagInput').type('react tag1');
    cy.get('.form_postBtn').click();
    cy.get('.input_error').contains("Not enough reputation to create new tags.");
  });

  it('Should create question with all tags associated, and create new ones if enough rep', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Tags').click();
    cy.contains('7 Tags');
    cy.contains('Ask a Question').click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('#formTitleInput').type('New Question');
    cy.get('#formTextInput').type('New Question Text');
    cy.get('#formTagInput').type('react tag1');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').first().contains("New Question")
    cy.get('.question_tags').first().contains('react');
    cy.get('.question_tags').first().contains('tag1');
    cy.contains('Tags').click();
    cy.contains('8 Tags');
    cy.contains('tag1')
  });

  it('Should create question with all tags associated, and ignore repeated whitespace', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Tags').click();
    cy.contains('7 Tags');
    cy.contains('Ask a Question').click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('#formTitleInput').type('New Question');
    cy.get('#formTextInput').type('New Question Text');
    cy.get('#formTagInput').type('react  tag1  javascript');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').first().contains("New Question")
    cy.get('.question_tags').first().contains('react');
    cy.get('.question_tags').first().contains('tag1');
    cy.get('.question_tags').first().contains('javascript');
    cy.contains('Tags').click();
    cy.contains('8 Tags');
    cy.contains('tag1');
  });

  it('Should show all associated tags on answer page', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Tags').click();
    cy.contains('7 Tags');
    cy.contains('Ask a Question').click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('#formTitleInput').type('New Question');
    cy.get('#formTextInput').type('New Question Text');
    cy.get('#formTagInput').type('react tag1');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').first().contains("New Question");
    cy.get('.postTitle').first().click()
    cy.get('.question_tags').contains('react');
    cy.get('.question_tags').contains('tag1');
    cy.get('.question_tag_button').contains('react').click();
    cy.get('.postTitle').contains("New Question");
  });

  it('Should create question with all tags associated made lowercase', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Tags').click();
    cy.contains('7 Tags');
    cy.contains('Ask a Question').click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('#formTitleInput').type('New Question');
    cy.get('#formTextInput').type('New Question Text');
    cy.get('#formTagInput').type('rEaCt tAg1');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').first().contains("New Question")
    cy.get('.question_tags').first().contains('react');
    cy.get('.question_tags').first().contains('tag1');
    cy.contains('Tags').click();
    cy.contains('8 Tags');
    cy.contains('tag1');
    cy.contains('react');
    cy.get('.tagName').contains('rEaCt').should('not.exist');
    cy.get('.tagName').contains('tAg1').should('not.exist');

  });

  it('Should create question without duplicating tags if they are entered more than once', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Tags').click();
    cy.contains('7 Tags');
    cy.contains('Ask a Question').click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('#formTitleInput').type('New Question');
    cy.get('#formTextInput').type('New Question Text');
    cy.get('#formTagInput').type('new new new');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').first().contains("New Question");
    cy.get('.question_tags').first().find('.question_tag_button').should('have.length', 1);
  });

  it('Should create question even if more than 5 tags associated if there are at most 5 unique', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Tags').click();
    cy.contains('7 Tags');
    cy.contains('Ask a Question').click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('#formTitleInput').type('New Question');
    cy.get('#formTextInput').type('New Question Text');
    cy.get('#formTagInput').type('new new1 new2 new3 new4 new1 new new2 new4');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').first().contains("New Question");
    cy.get('.question_tags').first().find('.question_tag_button').should('have.length', 5);
  });


});