beforeEach(() => {
  cy.task('dbTeardown');
  cy.task('dbSeed');
})

describe('Viewing User Profiles', () => {
  it('Should be able to show user profiles with hidden PI of posters and unable to edit when not logged in', () => {
    cy.visit('http://localhost:3000');
    cy.get('.question_author').first().click()
    cy.get('.info-line').first().contains("Display Name: commenter");
    cy.get('.info-line').contains("Email: test5@gmail.com").should('not.exist');
    cy.get('.info-line').contains("Name: Comment Here").should('not.exist');
    cy.get('.bluebtn').contains("Edit Profile").should('not.exist');
  });

  it('Should be able to show full user profile when logged in', () => {
    const askedQuestionTitles = ["Programmatically navigate using React router"];
    const askedQuestionTimes = ["Jan 20, 2022 at 03:00:00"];
    const ansQuestionTitles = ["Programmatically navigate using React router", "Object storage for a web application"]
    const ansQuestionTimes = ["Nov 20 at 03:24:42", "Feb 19, 2023 at 18:20:59"]
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').first().contains("Display Name: mkrstulovic");
    cy.get('.info-line').contains("Joined: Apr 03, 2023 at 18:20:59");
    cy.get('.info-line').contains("Last seen: Apr 04, 2023 at 18:20:59");
    cy.get('.info-line').contains("Email: test1@gmail.com");
    cy.get('.info-line').contains("Name: Marko Krstulovic");
    cy.get('.info-line').contains("40000 reputation earned");
    cy.get('.info-line').contains("1 questions asked");
    cy.get('.info-line').contains("2 questions answered");
    cy.get('.about-summary').contains("I AM A CODER. I LOVE CODE.");

    //Check that asked questions appear correctly.
    cy.get('.questions-list').first().find('.question').each(($el, index) => {
      cy.wrap($el).should('contain', askedQuestionTitles[index]);
      cy.wrap($el).should('contain', askedQuestionTimes[index]);
    });

    //Check that answered questions appear correctly and in order of most recent answered.
    cy.get('.questions-list').eq(1).find('.question').each(($el, index) => {
      cy.wrap($el).should('contain', ansQuestionTitles[index]);
      cy.wrap($el).should('contain', ansQuestionTimes[index]);
    });
  });

  it('Should be access user profiles from home page, question page, answers, and comments', () => {
    cy.visit('http://localhost:3000');
    //Check through home page
    cy.get('.question_author').first().click()
    cy.get('.info-line').first().contains("Display Name: commenter");
    cy.get('.bluebtn').contains("Edit Profile").should('not.exist');
    //Check through answer page, question auithor
    cy.get('.menu_button').contains("Questions").click();
    cy.get('.postTitle').contains("Programmatically navigate using React router").click();
    cy.get('.post_author').first().contains('mkrstulovic').click();
    cy.get('.info-line').first().contains("Display Name: mkrstulovic");
    cy.get('.bluebtn').contains("Edit Profile").should('not.exist');
    //Check through answer page, answer author
    cy.get('.menu_button').contains("Questions").click();
    cy.get('.postTitle').contains("Programmatically navigate using React router").click();
    cy.get('.post_author').eq(2).contains('thean').click();
    cy.get('.info-line').first().contains("Display Name: thean");
    cy.get('.bluebtn').contains("Edit Profile").should('not.exist');
    //Check through answer page, comment author
    cy.get('.menu_button').contains("Questions").click();
    cy.get('.postTitle').contains("Programmatically navigate using React router").click();
    cy.get('.comment_author').first().contains('commenter').click();
    cy.get('.info-line').first().contains("Display Name: commenter");
    cy.get('.bluebtn').contains("Edit Profile").should('not.exist');
  });

  it('Should show full information if clicking on your profile through questions', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.question_author').contains("mkrstulovic").click()
    cy.get('.info-line').first().contains("Display Name: mkrstulovic");
    cy.get('.info-line').contains("Email: test1@gmail.com");
    cy.get('.info-line').contains("Name: Marko Krstulovic");
    cy.get('.bluebtn').contains("Edit Profile").should('exist');
  });

  it('Should swap to logged in profile if Profile is clicked while on another profile', () => {
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.question_author').first().click()
    cy.get('.info-line').first().contains("Display Name: commenter");
    cy.get('.info-line').contains("Email: test5@gmail.com").should('not.exist');
    cy.get('.info-line').contains("Name: Comment Here").should('not.exist');
    cy.get('.bluebtn').contains("Edit Profile").should('not.exist');
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').first().contains("Display Name: mkrstulovic");
    cy.get('.info-line').contains("Email: test1@gmail.com");
    cy.get('.info-line').contains("Name: Marko Krstulovic");
    cy.get('.bluebtn').contains("Edit Profile").should('exist');
  });

  it('Should be able to redirect to answer page when question in asked questions list clicked when viewing profile', () => {
    const askedQuestionTitles = ["Programmatically navigate using React router"];
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').first().contains("Display Name: mkrstulovic");
    cy.get('.info-line').contains("Joined: Apr 03, 2023 at 18:20:59");
    cy.get('.info-line').contains("Last seen: Apr 04, 2023 at 18:20:59");
    cy.get('.info-line').contains("Email: test1@gmail.com");
    cy.get('.info-line').contains("Name: Marko Krstulovic");
    cy.get('.info-line').contains("40000 reputation earned");
    cy.get('.info-line').contains("1 questions asked");
    cy.get('.info-line').contains("2 questions answered");
    cy.get('.about-summary').contains("I AM A CODER. I LOVE CODE.");

    //Check you can access asked question pages from profile.
    cy.get('.questions-list').first().find('.question').first().contains(askedQuestionTitles[0]).click();
    cy.get('.bold_title').contains(askedQuestionTitles[0]);
  });

  it('Should be able to redirect to answer page when question in answered questions list clicked when viewing profile', () => {
    const ansQuestionTitles = ["Programmatically navigate using React router", "Object storage for a web application"]
    cy.visit('http://localhost:3000');
    cy.get('.bluebtn').contains("Sign In").click();
    cy.get('#formEmailInput').type('test1@gmail.com');
    cy.get('#formPasswordInput').type('test123');
    cy.get('.form_postBtn').click();
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('.info-line').first().contains("Display Name: mkrstulovic");
    cy.get('.info-line').contains("Joined: Apr 03, 2023 at 18:20:59");
    cy.get('.info-line').contains("Last seen: Apr 04, 2023 at 18:20:59");
    cy.get('.info-line').contains("Email: test1@gmail.com");
    cy.get('.info-line').contains("Name: Marko Krstulovic");
    cy.get('.info-line').contains("40000 reputation earned");
    cy.get('.info-line').contains("1 questions asked");
    cy.get('.info-line').contains("2 questions answered");
    cy.get('.about-summary').contains("I AM A CODER. I LOVE CODE.");

    //Check you can access asked question pages from profile.
    cy.get('.questions-list').eq(1).find('.question').contains(ansQuestionTitles[1]).click();
    cy.get('.bold_title').contains(ansQuestionTitles[1]);
  });
});