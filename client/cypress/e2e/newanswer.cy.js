beforeEach(() => {
    cy.task('dbTeardown');
    cy.task('dbSeed');
})

describe('New Answer Page 1', () => {
    it('Create new answer should be displayed at the top of the answers page', () => {
        const answers = ["React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.", "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.", "Test Answer 1"];
        cy.visit('http://localhost:3000');
        cy.contains('Sign In').click();
        cy.get('#formEmailInput').type('test1@gmail.com');
        cy.get('#formPasswordInput').type('test123');
        cy.get('.form_postBtn').click();
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('Answer Question').click();
        cy.get('#answerTextInput').type(answers[answers.length - 1]);
        cy.contains('Post Answer').click();
        cy.get('.postText').each(($el, index) => {
            if (index > 0) { // first element is the question
                cy.wrap($el).should('contain', answers[index-1]);
            }
        });
        cy.contains('mkrstulovic');
        cy.contains('0 seconds ago');
    });
});

describe('New Answer Page 2', () => {
    it('Answer is mandatory when creating a new answer', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Sign In').click();
        cy.get('#formEmailInput').type('test1@gmail.com');
        cy.get('#formPasswordInput').type('test123');
        cy.get('.form_postBtn').click();
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('Answer Question').click();
        cy.contains('Post Answer').click();
        cy.contains('Answer text cannot be empty');
    });
});

describe('New Answer Page 3', () => {
    it('successfully displays the answer textbox for the new answer page', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Sign In').click();
        cy.get('#formEmailInput').type('test1@gmail.com');
        cy.get('#formPasswordInput').type('test123');
        cy.get('.form_postBtn').click();
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('Answer Question').click();
        cy.get('#answerTextInput').should('exist');
    });
});

describe('New Answer Page 4', () => {
    it('successfully displays the Answer Text fields for the new answer page', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Sign In').click();
        cy.get('#formEmailInput').type('test1@gmail.com');
        cy.get('#formPasswordInput').type('test123');
        cy.get('.form_postBtn').click();
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('Answer Question').click();
        cy.contains("Answer Text");
    });
});

describe('New Answer Page 5', () => {
    it('Create new answer should increase the count of the answers on question page', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Sign In').click();
        cy.get('#formEmailInput').type('test1@gmail.com');
        cy.get('#formPasswordInput').type('test123');
        cy.get('.form_postBtn').click();
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('2 answers');
        cy.contains('Answer Question').click();
        cy.get('#answerTextInput').type("Test Answer 1");
        cy.contains('Post Answer').click();
        cy.contains('3 answers');
    });
});

describe('New Answer Page 6', () => {
    it('Create new answer should be displayed at the bottom of the answers page after logging in through create button', () => {
        const answers = ["React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.", "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.", "Test Answer 1"];
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('Answer Question').click();
        cy.get('#formEmailInput').type('test1@gmail.com');
        cy.get('#formPasswordInput').type('test123');
        cy.get('.form_postBtn').click();
        cy.get('#answerTextInput').type(answers[answers.length - 1]);
        cy.contains('Post Answer').click();
        cy.get('.postText').each(($el, index) => {
            if (index > 0){ // the first element is the question
                cy.wrap($el).should('contain', answers[index-1]);
            }
        });
        cy.contains('mkrstulovic');
        cy.contains('0 seconds ago');
    });
});
