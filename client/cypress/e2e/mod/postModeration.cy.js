beforeEach(() => {
  cy.task('dbTeardown');
  cy.task('dbSeed');
})

describe('Post Moderation - Flagging Visibility', () => {
  const qTitle = "Programmatically navigate using React router";
  it('Should not show flag button if not logged in', () => {
    cy.visit('http://localhost:3000');
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.flag_close_reopen').should('not.exist');
    cy.get('.vote_flag').first().find('.flag').should('not.exist');
  })

  it('Should hide flag if not enough reputation on questions and answers, but should show flag on comments if logged in', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test6@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.flag_close_reopen').should('not.exist');
    cy.get('.vote_flag').first().find('.flag').should('exist');
  })
})

describe('Post Moderation - Flagging Comments', () => {
  const qTitle = "Programmatically navigate using React router";

  it('Should show snackbar if logged in but not enough rep when flag comment clicked', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test6@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.vote_flag').first().find('.flag').should('exist');
    cy.get('.vote_flag').first().find('.flag').click();
    cy.wait(30)
    cy.get('.Snackbar__message', {timeout: 1}).contains("Needs at least 15 reputation to flag");
  })

  it('Should disable flag if enough reputation, but post owner', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test5@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.vote_flag').first().find('.flag').should('exist');
    cy.get('.vote_flag').first().find('.flag').should('be.disabled');
  })

  it('Should show flag button on comments if logged in with enough rep', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.wait(1000)
    cy.get('.vote_flag').first().find('.flag').should('exist');
  })

  it('Should flag comment if user clicks inactive flag with enough rep', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.wait(1000)
    cy.get('.vote_flag').eq(1).find('.flag').find('.flag-transparent').should('exist');
    cy.get('.vote_flag').eq(1).find('.flag').find('.flag-transparent').click();
    cy.get('.vote_flag').eq(1).find('.flag').find('.flag-black').should('exist');
  })

  it('Should unflag comment if user clicks active flag with enough rep', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.wait(1000)
    cy.get('.vote_flag').eq(1).find('.flag').find('.flag-transparent').should('exist');
    cy.get('.vote_flag').eq(1).find('.flag').find('.flag-transparent').click();
    cy.get('.vote_flag').eq(1).find('.flag').find('.flag-black').should('exist');
    cy.get('.vote_flag').eq(1).find('.flag').find('.flag-black').should('exist');
    cy.get('.vote_flag').eq(1).find('.flag').find('.flag-black').click();
    cy.get('.vote_flag').eq(1).find('.flag').find('.flag-transparent').should('exist');
  })

  it('Should delete comment if 6 users flag it', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.wait(1000)
    cy.get('.vote_flag').first().find('.flag').find('.flag-transparent').should('exist');
    cy.get('.vote_flag').first().find('.flag').find('.flag-transparent').click();
    cy.get('.comment_text').contains("Comment 4").should('not.exist');
    cy.get('.menu_button').contains("Questions").click();
    cy.get('.question_author').contains('commenter').click()
    cy.get('.info-line').first().contains(`Display Name: commenter`);
    cy.get('.info-line').contains('1 reputation earned');
  })
})


describe('Post Moderation - Flagging Questions', () => {
  const qTitle = "Programmatically navigate using React router";

  it('Should disable flag if enough reputation, but post owner', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').should('exist');
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').first().should('be.disabled');
  })

  it('Should show flag button on questions if logged in with enough rep', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.wait(1000)
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').should('exist');
  })

  it('Should flag question and increment count if user clicks inactive flag with enough rep', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.wait(1000)
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').should('exist');
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').click();
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains('flag (1)');
  })

  it('Should unflag question if user clicks active flag with enough rep', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.wait(1000)
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').should('exist');
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').click();
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains('flag (1)');
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').should('exist');
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').click();
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains('flag');
  })

  it('Should delete a question and display snackbar to user if 6 users flag it', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains('Object storage for a web application').click();
    cy.wait(1000)
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').should('exist');
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').click();
    cy.wait(30)
    cy.get('.Snackbar__message', {timeout: 1}).contains("Question does not exist. Please head back to the Main Page.");
    cy.get(".answer_question_title").should('not.exist');
    cy.get('.menu_button').contains("Questions").click();
    cy.get('.postTitle').contains('What does the Fox Say?').click();
    cy.get('.comment_author').contains('voteUp').click();
    cy.get('.info-line').first().contains(`Display Name: voteUp`);
    cy.get('.info-line').contains('1 reputation earned');
  })
})


describe('Post Moderation - Flagging Answers', () => {
  const qTitle = "Programmatically navigate using React router";

  it('Should disable flag if enough reputation, but post owner', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.get('.flag_close_reopen_container').eq(1)
      .find('.flag_close_reopen').should('exist');
    cy.get('.flag_close_reopen_container').eq(1)
      .find('.flag_close_reopen').should('be.disabled');
  })

  it('Should show flag button on answers if logged in with enough rep', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.wait(1000)
    cy.get('.flag_close_reopen_container').eq(1)
      .find('.flag_close_reopen').should('exist');
  })

  it('Should flag answer and increment count if user clicks inactive flag with enough rep', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.wait(1000)
    cy.get('.flag_close_reopen_container').eq(1)
      .find('.flag_close_reopen').should('exist');
    cy.get('.flag_close_reopen_container').eq(1)
      .find('.flag_close_reopen').click();
    cy.get('.flag_close_reopen_container').eq(1)
      .find('.flag_close_reopen').contains('flag (1)');
  })

  it('Should unflag answer if user clicks active flag with enough rep', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitle).click();
    cy.wait(1000)
    cy.get('.flag_close_reopen_container').eq(1)
      .find('.flag_close_reopen').should('exist');
    cy.get('.flag_close_reopen_container').eq(1)
      .find('.flag_close_reopen').click();
    cy.get('.flag_close_reopen_container').eq(1)
      .find('.flag_close_reopen').contains('flag (1)');
    cy.get('.flag_close_reopen_container').eq(1)
      .find('.flag_close_reopen').should('exist');
    cy.get('.flag_close_reopen_container').eq(1)
      .find('.flag_close_reopen').click();
    cy.get('.flag_close_reopen_container').eq(1)
      .find('.flag_close_reopen').contains('flag');
  })

  it('Should delete an answer and inform user if 6 users flag it', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains('Programmatically navigate using React router').click();
    cy.wait(1000)
    cy.get('.flag_close_reopen_container').eq(2)
      .find('.flag_close_reopen').should('exist');
    cy.get('.flag_close_reopen_container').eq(2)
      .find('.flag_close_reopen').click();
    cy.get(".postText").contains('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.')
      .should('not.exist');
    cy.get('.menu_button').contains("Questions").click();
    cy.get('.question_author').contains('thean').click();
    cy.get('.info-line').first().contains(`Display Name: thean`);
    cy.get('.info-line').contains('1400 reputation earned');
  })
})


describe('Post Moderation - Closing/Reopening', () => {
  const qTitleOpen = "Programmatically navigate using React router";
  const qTitleClosed = "What does the Fox Say? [closed]";
  it('Should not show close button if not logged in', () => {
    cy.visit('http://localhost:3000');
    cy.get('.postTitle').contains(qTitleOpen).click();
    cy.get('.flag_close_reopen').should('not.exist');
  })

  it('Should not show reopen button if not logged in', () => {
    cy.visit('http://localhost:3000');
    cy.get('.postTitle').contains(qTitleClosed).click();
    cy.get('.flag_close_reopen').should('not.exist');
  })

  it('Should not show close if not enough reputation', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test6@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitleOpen).click();
    cy.get('.flag_close_reopen').should('not.exist');
  })

  it('Should not show reopen if not enough reputation', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test6@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitleClosed).click();
    cy.get('.flag_close_reopen').should('not.exist');
  })

  it('Should disable reopen if enough reputation, but post owner', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('c1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitleOpen).click();
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains('Close').click();
    cy.get('.bluebtn').contains("Sign Out").click();
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('c2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitleOpen).click();
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains('Close (1)').click();
    cy.get('.bluebtn').contains("Sign Out").click();
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('c3@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitleOpen).click();
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains('Close (2)').click();
    cy.get('.bluebtn').contains("Sign Out").click();
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitleOpen + " [closed]").click();
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains("Reopen").should('exist');
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains("Reopen").should('be.disabled');
  })

  it('Should disable close if enough reputation, but post owner', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitleOpen).click();
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains("Close").should('exist');
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains("Close").should('be.disabled');
  })

  it('Should show flag if enough reputation, but hide close/reopen text if not enough rep', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test5@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitleClosed).click();
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains("flag (1)").should('exist');
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains("Reopen").should('not.exist');
  })

  it('Shows closed count incremented by one when clicking close and decrements count by 1 when undoing', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('c1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitleOpen).click();
    cy.wait(1000)
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains('Close').should('exist');
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains('Close').click();
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains('Close (1)');
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains('Close (1)').click();
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains('Close');
  })

  it('Shows closed questions as unable to add answers, but can add comments', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('c1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitleClosed).click();
    cy.wait(1000)
    cy.get('.bluebtn').contains("Answer Question").should('not.exist');
    cy.get('.comment_button').first().click()
    cy.get(".comment-textarea").first().should('exist');
  })


  it('Shows reopen count incremented by one when clicking reopen and decrements count by 1 when undoing', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('c1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitleClosed).click();
    cy.wait(1000)
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains('Reopen').should('exist');
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains('Reopen').click();
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains('Reopen (1)');
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains('Reopen (1)').click();
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains('Reopen');
  })

  it('Should close question if user adds third close vote', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('c1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitleOpen).click();
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains('Close').click();
    cy.get('.bluebtn').contains("Sign Out").click();
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('c2@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitleOpen).click();
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains('Close (1)').click();
    cy.get('.bluebtn').contains("Sign Out").click();
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('c3@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.postTitle').contains(qTitleOpen).click();
    cy.wait(1000)
    cy.get('.flag_close_reopen_container').first()
      .find('.flag_close_reopen').contains('Close (2)').click();
    cy.get('.bluebtn').contains("Answer Question").should('not.exist');
    cy.get('.bold_title').contains(qTitleOpen + " [closed]");
    cy.get('#menu_question').click();
    cy.get('.postTitle').contains(qTitleOpen + " [closed]");
  })
})
