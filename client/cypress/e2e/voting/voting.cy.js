beforeEach(() => {
  cy.task('dbTeardown');
  cy.task('dbSeed');
})


describe('Post Voting - Comments', () => {
  const qTitle = "Programmatically navigate using React router";
  it('Should hide upvote button on comments if not logged in', () => {
    cy.visit('http://localhost:3000');
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.flag_close_reopen').should('not.exist');
    cy.get('.vote_flag').first().find('.upvote').should('not.exist');
  });

  it('Should display snackbar if logged in but not enough reputation when clicking upvote on comment', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test6@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.vote_flag').first().find('.upvote').should('exist');
    cy.get('.vote_flag').first().find('.upvote').click();
    cy.wait(30)
    cy.get('.Snackbar__message', {timeout: 1}).contains("Needs at least 15 reputation to upvote");
  });

  it('Should disable upvote button if owner of comment when clicking upvote on comment', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test5@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.vote_flag').first().find('.upvote').should('exist');
    cy.get('.vote_flag').first().find('.upvote').should('be.disabled');
  });

  it('Should increment score by 1 and update styling when clicking upvote on comment for first time', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.vote_flag').first().find('.upvote').should('exist');
    cy.get('.vote_flag').first().find('.upvote').find('.upvote-transparent');
    cy.get('.comment_score').first().contains(0);
    cy.get('.vote_flag').first().find('.upvote').click();
    cy.get('.comment_score').first().contains(1);
    cy.get('.vote_flag').first().find('.upvote').find('.upvote-black');
  });

  it('Should decrement score by 1 and update styling when undoing comment upvote', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.vote_flag').first().find('.upvote').should('exist');
    cy.get('.vote_flag').first().find('.upvote').find('.upvote-transparent');
    cy.get('.comment_score').first().contains(0);
    cy.get('.vote_flag').first().find('.upvote').click();
    cy.get('.comment_score').first().contains(1);
    cy.get('.vote_flag').first().find('.upvote').find('.upvote-black');
    cy.get('.vote_flag').first().find('.upvote').click();
    cy.get('.comment_score').first().contains(0);
    cy.get('.vote_flag').first().find('.upvote').find('.upvote-transparent');
  });
});


describe('Post Voting - Questions', () => {
  const qTitle = "Programmatically navigate using React router";
  const qAuthor = "mkrstulovic";
  const qAuthRepStart = 40000;
  const voter = "voteDown";
  const voterRepStart = 125;
  it('Should redirect to login screen and back to question page if not logged in when upvote clicked', () => {
    cy.visit('http://localhost:3000');
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.upvote_button').first().should('exist');
    cy.get('.upvote_button').first().click();
    cy.get('.form_postBtn').contains("Login").should('exist');
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').contains("Login").click();
    cy.get('.bold_title').contains(qTitle);
  });
  it('Should redirect to login screen and back to question page if not logged in when downvote clicked', () => {
    cy.visit('http://localhost:3000');
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.downvote_button').first().should('exist');
    cy.get('.downvote_button').first().click();
    cy.get('.form_postBtn').contains("Login").should('exist');
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').contains("Login").click();
    cy.get('.bold_title').contains(qTitle);
  });

  it('Should disable upvote and downvote buttons if logged in as owner of question', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.upvote_button').should('exist');
    cy.get('.upvote_button').first().should('be.disabled');
    cy.get('.downvote_button').should('exist');
    cy.get('.downvote_button').first().should('be.disabled');
  });

  it('Should display snackbar if logged in but not enough reputation when clicking upvote on question', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test6@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.upvote_button').should('exist');
    cy.get('.upvote_button').first().should('exist');
    cy.get('.upvote_button').first().click();
    cy.wait(30)
    cy.get('.Snackbar__message', {timeout: 1}).contains("Needs at least 15 reputation to upvote");
  });

  it('Should display snackbar if logged in but not enough reputation when clicking downvote on question', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test6@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.downvote_button').should('exist');
    cy.get('.downvote_button').first().should('exist');
    cy.get('.downvote_button').first().click();
    cy.wait(6)
    cy.get('.Snackbar__message', {timeout: 1}).contains("Needs at least 125 reputation to downvote");
  });

  it('Should increment score by 1, update styling/owner rep when clicking upvote on question for first time', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test4@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.post_score').first().contains(2);
    cy.get('.upvote_button').should('exist');
    cy.get('.upvote_button').first().should('exist');
    cy.get('.upvote_button').first().should('have.attr', 'class').and('contain', 'white-bg')
    cy.get('.upvote_button').first().click();
    cy.get('.post_score').first().contains(3);
    cy.get('.upvote_button').first().should('have.attr', 'class').and('contain', 'green-bg')
    cy.get('.post_author').first().contains(qAuthor)
    cy.get('.post_author').first().contains(qAuthor).click()
    cy.get('.info-line').first().contains(`Display Name: ${qAuthor}`);
    cy.get('.info-line').contains(`${qAuthRepStart + 10} reputation earned`);
  });

  it('Should decrement score by 1, update styling/owner rep/voter rep when clicking downvote on question for first time', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test4@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.post_score').first().contains(2);
    cy.get('.downvote_button').should('exist');
    cy.get('.downvote_button').first().should('exist');
    cy.get('.downvote_button').first().should('have.attr', 'class').and('contain', 'white-bg')
    cy.get('.downvote_button').first().click();
    cy.get('.post_score').first().contains(1);
    cy.get('.downvote_button').first().should('have.attr', 'class').and('contain', 'green-bg')
    cy.get('.post_author').first().contains(qAuthor)
    cy.get('.post_author').first().contains(qAuthor).click()
    cy.get('.info-line').first().contains(`Display Name: ${qAuthor}`);
    cy.get('.info-line').contains(`${qAuthRepStart - 2} reputation earned`);
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').first().contains(`Display Name: ${voter}`);
    cy.get('.info-line').contains(`${voterRepStart - 1} reputation earned`)
  });

  it('Should decrement score by 1, update styling/owner rep when clicking upvote on question when already upvoted', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.post_score').first().contains(2);
    cy.get('.upvote_button').should('exist');
    cy.get('.upvote_button').first().should('exist');
    cy.get('.upvote_button').first().should('have.attr', 'class').and('contain', 'green-bg')
    cy.get('.upvote_button').first().click();
    cy.get('.post_score').first().contains(1);
    cy.get('.upvote_button').first().should('have.attr', 'class').and('contain', 'white-bg')
    cy.get('.post_author').first().contains(qAuthor)
    cy.get('.post_author').first().contains(qAuthor).click()
    cy.get('.info-line').first().contains(`Display Name: ${qAuthor}`);
    cy.get('.info-line').contains(`${qAuthRepStart - 10} reputation earned`);
  });

  it('Should decrement score by 1, update styling/owner rep/voter rep when clicking downvote on question when already downvoted', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test4@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.post_score').first().contains(2);
    cy.get('.downvote_button').should('exist');
    cy.get('.downvote_button').first().should('exist');
    cy.get('.downvote_button').first().should('have.attr', 'class').and('contain', 'white-bg')
    cy.get('.downvote_button').first().click();
    cy.get('.post_score').first().contains(1);
    cy.get('.downvote_button').first().should('have.attr', 'class').and('contain', 'green-bg')
    cy.get('.post_author').first().contains(qAuthor);
    cy.get('.post_author').first().contains(qAuthor).click()
    cy.get('.info-line').first().contains(`Display Name: ${qAuthor}`);
    cy.get('.info-line').contains(`${qAuthRepStart - 2} reputation earned`);
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').first().contains(`Display Name: ${voter}`);
    cy.get('.info-line').contains(`${voterRepStart - 1} reputation earned`);
    //Voter rep is now below threshold to click downvote, but we should still allow undoing vote.
    cy.get('.menu_button').contains("Questions").click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.post_score').first().contains(1);
    cy.get('.downvote_button').first().should('have.attr', 'class').and('contain', 'green-bg')
    cy.get('.downvote_button').first().click();
    cy.get('.downvote_button').first().should('have.attr', 'class').and('contain', 'white-bg')
    cy.get('.post_author').first().contains(qAuthor);
    cy.get('.post_author').first().contains(qAuthor).click()
    cy.get('.info-line').first().contains(`Display Name: ${qAuthor}`);
    cy.get('.info-line').contains(`${qAuthRepStart} reputation earned`);
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').first().contains(`Display Name: ${voter}`);
    cy.get('.info-line').contains(`${voterRepStart} reputation earned`);
  });

  it('Should decrement score by 2, update styling/owner rep/voter rep when clicking downvote on question when already upvoted', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.post_score').first().contains(2);
    cy.get('.downvote_button').should('exist');
    cy.get('.upvote_button').first().should('have.attr', 'class').and('contain', 'green-bg')
    cy.get('.downvote_button').first().should('have.attr', 'class').and('contain', 'white-bg')
    cy.get('.downvote_button').first().click();
    cy.get('.post_score').first().contains(0);
    cy.get('.downvote_button').first().should('have.attr', 'class').and('contain', 'green-bg')
    cy.get('.upvote_button').first().should('have.attr', 'class').and('contain', 'white-bg')
    cy.get('.post_author').first().contains(qAuthor)
    cy.get('.post_author').first().contains(qAuthor).click()
    cy.get('.info-line').first().contains(`Display Name: ${qAuthor}`);
    cy.get('.info-line').contains(`${qAuthRepStart - 12} reputation earned`);
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').first().contains(`Display Name: thean`);
    cy.get('.info-line').contains(`${1500 - 1} reputation earned`);
  });

  it('Should increment score by 2, update styling/owner rep/voter rep when clicking upvote on question when already downvoted', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test4@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.post_score').first().contains(2);
    cy.get('.downvote_button').should('exist');
    cy.get('.downvote_button').first().should('have.attr', 'class').and('contain', 'white-bg')
    cy.get('.downvote_button').first().click();
    cy.get('.post_score').first().contains(1);
    cy.get('.downvote_button').first().should('have.attr', 'class').and('contain', 'green-bg')
    cy.get('.post_author').first().contains(qAuthor)
    cy.get('.post_author').first().contains(qAuthor).click()
    cy.get('.info-line').first().contains(`Display Name: ${qAuthor}`);
    cy.get('.info-line').contains(`${qAuthRepStart - 2} reputation earned`);
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').first().contains(`Display Name: ${voter}`);
    cy.get('.info-line').contains(`${voterRepStart - 1} reputation earned`);
    cy.get('.menu_button').contains("Questions").click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.downvote_button').should('exist');
    cy.get('.post_score').first().contains(1);
    cy.get('.upvote_button').first().should('have.attr', 'class').and('contain', 'white-bg')
    cy.get('.downvote_button').first().should('have.attr', 'class').and('contain', 'green-bg')
    cy.get('.upvote_button').first().click();
    cy.get('.post_score').first().contains(3);
    cy.get('.downvote_button').first().should('have.attr', 'class').and('contain', 'white-bg')
    cy.get('.upvote_button').first().should('have.attr', 'class').and('contain', 'green-bg')
    cy.get('.post_author').first().contains(qAuthor)
    cy.get('.post_author').first().contains(qAuthor).click()
    cy.get('.info-line').first().contains(`Display Name: ${qAuthor}`);
    cy.get('.info-line').contains(`${qAuthRepStart + 10} reputation earned`);
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').first().contains(`Display Name: ${voter}`);
    cy.get('.info-line').contains(`${voterRepStart} reputation earned`);
  });

});


describe('Post Voting - Answers', () => {
  const qTitle = "Programmatically navigate using React router";
  const qAuthor = "mkrstulovic";
  const qAuthRepStart = 40000;
  const voter = "voteDown";
  const voterRepStart = 125;
  it('Should redirect to login screen and back to question page if not logged in when upvote clicked', () => {
    cy.visit('http://localhost:3000');
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.upvote_button').eq(1).should('exist');
    cy.get('.upvote_button').eq(1).click();
    cy.get('.form_postBtn').contains("Login").should('exist');
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').contains("Login").click();
    cy.get('.bold_title').contains(qTitle);
  });
  it('Should redirect to login screen and back to question page if not logged in when downvote clicked', () => {
    cy.visit('http://localhost:3000');
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.downvote_button').eq(1).should('exist');
    cy.get('.downvote_button').eq(1).click();
    cy.get('.form_postBtn').contains("Login").should('exist');
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').contains("Login").click();
    cy.get('.bold_title').contains(qTitle);
  });

  it('Should disable upvote and downvote buttons if logged in as owner of answer', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.upvote_button').should('exist');
    cy.get('.upvote_button').eq(1).should('be.disabled');
    cy.get('.downvote_button').should('exist');
    cy.get('.downvote_button').eq(1).should('be.disabled');
  });

  it('Should display snackbar if logged in but not enough reputation when clicking upvote on answer', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test6@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.upvote_button').should('exist');
    cy.get('.upvote_button').eq(1).should('exist');
    cy.get('.upvote_button').eq(1).click();
    cy.wait(30)
    cy.get('.Snackbar__message', {timeout: 1}).contains("Needs at least 15 reputation to upvote");
  });

  it('Should display snackbar if logged in but not enough reputation when clicking downvote on answer', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test6@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.downvote_button').should('exist');
    cy.get('.downvote_button').eq(1).should('exist');
    cy.get('.downvote_button').eq(1).click();
    cy.wait(6)
    cy.get('.Snackbar__message', {timeout: 1}).contains("Needs at least 125 reputation to downvote");
  });

  it('Should increment score by 1, update styling/owner rep when clicking upvote on answer for first time', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test4@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.post_score').eq(1).contains(2);
    cy.get('.upvote_button').should('exist');
    cy.get('.upvote_button').eq(1).should('exist');
    cy.get('.upvote_button').eq(1).should('have.attr', 'class').and('contain', 'white-bg')
    cy.get('.upvote_button').eq(1).click();
    cy.get('.post_score').eq(1).contains(3);
    cy.get('.upvote_button').eq(1).should('have.attr', 'class').and('contain', 'green-bg')
    cy.get('.post_author').eq(1).contains(qAuthor)
    cy.get('.post_author').eq(1).contains(qAuthor).click()
    cy.get('.info-line').first().contains(`Display Name: ${qAuthor}`);
    cy.get('.info-line').contains(`${qAuthRepStart + 10} reputation earned`);
  });

  it('Should decrement score by 1, update styling/owner rep/voter rep when clicking downvote on answer for first time', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test4@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.post_score').eq(1).contains(2);
    cy.get('.downvote_button').should('exist');
    cy.get('.downvote_button').eq(1).should('exist');
    cy.get('.downvote_button').eq(1).should('have.attr', 'class').and('contain', 'white-bg')
    cy.get('.downvote_button').eq(1).click();
    cy.get('.post_score').eq(1).contains(1);
    cy.get('.downvote_button').eq(1).should('have.attr', 'class').and('contain', 'green-bg')
    cy.get('.post_author').eq(1).contains(qAuthor)
    cy.get('.post_author').eq(1).contains(qAuthor).click()
    cy.get('.info-line').first().contains(`Display Name: ${qAuthor}`);
    cy.get('.info-line').contains(`${qAuthRepStart - 2} reputation earned`);
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').first().contains(`Display Name: ${voter}`);
    cy.get('.info-line').contains(`${voterRepStart - 1} reputation earned`)
  });

  it('Should decrement score by 1, update styling/owner rep when clicking upvote on answer when already upvoted', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.post_score').eq(1).contains(2);
    cy.get('.upvote_button').should('exist');
    cy.get('.upvote_button').eq(1).should('exist');
    cy.get('.upvote_button').eq(1).should('have.attr', 'class').and('contain', 'green-bg')
    cy.get('.upvote_button').eq(1).click();
    cy.get('.post_score').eq(1).contains(1);
    cy.get('.upvote_button').eq(1).should('have.attr', 'class').and('contain', 'white-bg')
    cy.get('.post_author').eq(1).contains(qAuthor)
    cy.get('.post_author').eq(1).contains(qAuthor).click()
    cy.get('.info-line').first().contains(`Display Name: ${qAuthor}`);
    cy.get('.info-line').contains(`${qAuthRepStart - 10} reputation earned`);
  });

  it('Should decrement score by 1, update styling/owner rep/voter rep when clicking downvote on answer when already downvoted', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test4@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.post_score').eq(1).contains(2);
    cy.get('.downvote_button').should('exist');
    cy.get('.downvote_button').eq(1).should('exist');
    cy.get('.downvote_button').eq(1).should('have.attr', 'class').and('contain', 'white-bg')
    cy.get('.downvote_button').eq(1).click();
    cy.get('.post_score').eq(1).contains(1);
    cy.get('.downvote_button').eq(1).should('have.attr', 'class').and('contain', 'green-bg')
    cy.get('.post_author').eq(1).contains(qAuthor);
    cy.get('.post_author').eq(1).contains(qAuthor).click()
    cy.get('.info-line').first().contains(`Display Name: ${qAuthor}`);
    cy.get('.info-line').contains(`${qAuthRepStart - 2} reputation earned`);
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').first().contains(`Display Name: ${voter}`);
    cy.get('.info-line').contains(`${voterRepStart - 1} reputation earned`);
    //Voter rep is now below threshold to click downvote, but we should still allow undoing vote.
    cy.get('.menu_button').contains("Questions").click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.post_score').eq(1).contains(1);
    cy.get('.downvote_button').eq(1).should('have.attr', 'class').and('contain', 'green-bg')
    cy.get('.downvote_button').eq(1).click();
    cy.get('.downvote_button').eq(1).should('have.attr', 'class').and('contain', 'white-bg')
    cy.get('.post_author').eq(1).contains(qAuthor);
    cy.get('.post_author').eq(1).contains(qAuthor).click()
    cy.get('.info-line').first().contains(`Display Name: ${qAuthor}`);
    cy.get('.info-line').contains(`${qAuthRepStart} reputation earned`);
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').first().contains(`Display Name: ${voter}`);
    cy.get('.info-line').contains(`${voterRepStart} reputation earned`);
  });

  it('Should decrement score by 2, update styling/owner rep/voter rep when clicking downvote on answer when already upvoted', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.post_score').eq(1).contains(2);
    cy.get('.downvote_button').should('exist');
    cy.get('.upvote_button').eq(1).should('have.attr', 'class').and('contain', 'green-bg')
    cy.get('.downvote_button').eq(1).should('have.attr', 'class').and('contain', 'white-bg')
    cy.get('.downvote_button').eq(1).click();
    cy.get('.post_score').eq(1).contains(0);
    cy.get('.downvote_button').eq(1).should('have.attr', 'class').and('contain', 'green-bg')
    cy.get('.upvote_button').eq(1).should('have.attr', 'class').and('contain', 'white-bg')
    cy.get('.post_author').eq(1).contains(qAuthor)
    cy.get('.post_author').eq(1).contains(qAuthor).click()
    cy.get('.info-line').first().contains(`Display Name: ${qAuthor}`);
    cy.get('.info-line').contains(`${qAuthRepStart - 12} reputation earned`);
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').first().contains(`Display Name: thean`);
    cy.get('.info-line').contains(`${1500 - 1} reputation earned`);
  });

  it('Should increment score by 2, update styling/owner rep/voter rep when clicking upvote on answer when already downvoted', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test4@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.post_score').eq(1).contains(2);
    cy.get('.downvote_button').should('exist');
    cy.get('.downvote_button').eq(1).should('have.attr', 'class').and('contain', 'white-bg')
    cy.get('.downvote_button').eq(1).click();
    cy.get('.post_score').eq(1).contains(1);
    cy.get('.downvote_button').eq(1).should('have.attr', 'class').and('contain', 'green-bg')
    cy.get('.post_author').eq(1).contains(qAuthor)
    cy.get('.post_author').eq(1).contains(qAuthor).click()
    cy.get('.info-line').first().contains(`Display Name: ${qAuthor}`);
    cy.get('.info-line').contains(`${qAuthRepStart - 2} reputation earned`);
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').first().contains(`Display Name: ${voter}`);
    cy.get('.info-line').contains(`${voterRepStart - 1} reputation earned`);
    cy.get('.menu_button').contains("Questions").click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.downvote_button').should('exist');
    cy.get('.post_score').eq(1).contains(1);
    cy.get('.upvote_button').eq(1).should('have.attr', 'class').and('contain', 'white-bg')
    cy.get('.downvote_button').eq(1).should('have.attr', 'class').and('contain', 'green-bg')
    cy.get('.upvote_button').eq(1).click();
    cy.get('.post_score').eq(1).contains(3);
    cy.get('.downvote_button').eq(1).should('have.attr', 'class').and('contain', 'white-bg')
    cy.get('.upvote_button').eq(1).should('have.attr', 'class').and('contain', 'green-bg')
    cy.get('.post_author').eq(1).contains(qAuthor)
    cy.get('.post_author').eq(1).contains(qAuthor).click()
    cy.get('.info-line').first().contains(`Display Name: ${qAuthor}`);
    cy.get('.info-line').contains(`${qAuthRepStart + 10} reputation earned`);
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').first().contains(`Display Name: ${voter}`);
    cy.get('.info-line').contains(`${voterRepStart} reputation earned`);
  });

});

