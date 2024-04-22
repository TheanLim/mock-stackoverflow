beforeEach(() => {
    cy.task('dbTeardown');
    cy.task('dbSeed');
})


describe('Answer Page 1', () => {
    it('Answer Page displays expected header', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('#answersHeader').should('contain', 'Programmatically navigate using React router');
        cy.get('#answersHeader').should('contain', '2 answers');
        cy.get('#answersHeader').should('contain', 'Ask a Question');
        cy.get('#sideBarNav').should('contain', 'Questions');
        cy.get('#sideBarNav').should('contain', 'Tags');
    })
})

describe('Answer Page 2', () => {
    it('Answer Page displays expected question text and related comment(s)', () => {
        const text = 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.'
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('.post_comment_left').eq(0).should('contain', '2');
        cy.get('.post_comment_main').eq(0).should('contain', '11 views');
        cy.get('.post_comment_main').eq(0).should('contain', text);
        cy.get('.post_comment_main').eq(0).should('contain', 'mkrstulovic');
        cy.get('.post_comment_main').eq(0).should('contain', 'Jan 20, 2022');
        cy.get('.post_comment_main').eq(0).should('contain', '03:00');
        cy.get('.post_comment_main').eq(0).find('.comment').should('have.length', 1)
        cy.get('.post_comment_main').eq(0).find('.comment').should('contain', '0');
        cy.get('.post_comment_main').eq(0).find('.comment').should('contain', 'Comment 4');
        cy.get('.post_comment_main').eq(0).find('.comment').should('contain', 'commenter');
        cy.get('.post_comment_main').eq(0).find('.comment').should('contain', 'Apr 03, 2023');
        cy.get('.post_comment_main').eq(0).find('.comment').should('contain', '21:20:59');
    })
})

describe('Answer Page 3', () => {
    it('Answer Page displays expected answers, sorted by score by default. It should sort by answer date on clicking NEWEST', () => {
        const answers = [
            "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.", 
            "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router."
        ];
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('.post_comment_main').each(($el, index) => { // first element is the question
            if (index > 0) {
                cy.wrap($el).should('contain', answers[index - 1]);
            }
        });

        // Sort by newest
        cy.get('.sort_answers').contains('newest').click();
        cy.wait(500);
        const reversedAnswer = [...answers].reverse();
        cy.get('.post_comment_main').each(($el, index) => { // first element is the question
            if (index > 0) {
                cy.wrap($el).should('contain', reversedAnswer[index - 1]);
            }
        });
    });
});

describe('Answer Page 4', () => {
    it('Answer Page displays expected authors', () => {
        const authors = ['mkrstulovic', 'thean'];
        const date = ['Nov 20','Nov 23'];
        const times = ['03:24','08:24'];
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('.postAuthor').each(($el, index) => {
            if (index > 0) { // first element is the question
                cy.wrap($el).should('contain', authors[index-1]);
                cy.wrap($el).should('contain', date[index-1]);
                cy.wrap($el).should('contain', times[index-1]);
            }
        });
    });
});

describe('Answer Page 5', () => {
    it('Answer Page displays expected answer text and related comment(s)', () => {
        const text = "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node."
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('.post_comment_left').eq(1).should('contain', '2');
        cy.get('.post_comment_main').eq(1).should('contain', text);
        cy.get('.post_comment_main').eq(1).should('contain', 'mkrstulovic');
        cy.get('.post_comment_main').eq(1).should('contain', 'Nov 20');
        cy.get('.post_comment_main').eq(1).should('contain', '03:24:42');

        cy.get('.post_comment_main').eq(1).find('.comment').should('have.length', 2)
        // First comment
        cy.get('.post_comment_main').eq(1).find('.comment').eq(0).should('contain', '0');
        cy.get('.post_comment_main').eq(1).find('.comment').eq(0).should('contain', 'Comment 1');
        cy.get('.post_comment_main').eq(1).find('.comment').eq(0).should('contain', 'commenter');
        cy.get('.post_comment_main').eq(1).find('.comment').eq(0).should('contain', 'Apr 03, 2023');
        cy.get('.post_comment_main').eq(1).find('.comment').eq(0).should('contain', '18:20:59');
        //Second comment
        cy.get('.post_comment_main').eq(1).find('.comment').eq(1).should('contain', '1');
        cy.get('.post_comment_main').eq(1).find('.comment').eq(1).should('contain', 'Comment 6');
        cy.get('.post_comment_main').eq(1).find('.comment').eq(1).should('contain', 'commenter');
        cy.get('.post_comment_main').eq(1).find('.comment').eq(1).should('contain', 'Apr 03, 2023');
        cy.get('.post_comment_main').eq(1).find('.comment').eq(1).should('contain', '22:20:59');
    })
})
