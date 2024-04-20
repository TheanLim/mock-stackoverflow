beforeEach(() => {
    cy.task('dbTeardown');
    cy.task('dbSeed');
})


describe('Mark Solution', () => {
    it('User not logged in, but able to see the solution button but cannot click it.', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('.post_comment_left').eq(1).find('.solution-btn-icon-green').should('exist');
        cy.get('.post_comment_left').eq(1).find('.solution-btn').should('be.disabled');;
    })

    it('User logged in but not the question owner. Able to see the solution button but cannot click it.', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Sign In').click();
        cy.get('#formEmailInput').type('test2@gmail.com');
        cy.get('#formPasswordInput').type('test123');
        cy.get('.form_postBtn').click();
        cy.contains('Programmatically navigate using React router').click();
        cy.get('.post_comment_left').eq(1).find('.solution-btn-icon-green').should('exist');
        cy.get('.post_comment_left').eq(1).find('.solution-btn').should('be.disabled');;
    })

    it('Dont show the solution button to non post owner when no solution was chosen', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Quick question about storage on android').click();
        cy.get('.post_comment_left').eq(1).find('.solution-btn-icon-green').should('not.exist');
    })

    it('No solution was previously chosen. Solution owner click the solution button.', () => {
        cy.visit('http://localhost:3000');
        // Log in as the question owner
        cy.contains('Sign In').click();
        cy.get('#formEmailInput').type('test4@gmail.com');
        cy.get('#formPasswordInput').type('test123');
        cy.get('.form_postBtn').click();
        // Find the post
        cy.contains('Quick question about storage on android').click();
        // Verify no solution was chosen
        cy.get('.post_comment_left').eq(1).find('.solution-btn-icon-green').should('not.exist');
        cy.get('.post_comment_left').eq(1).find('.solution-btn-icon-transparent').should('exist');
        // Mark as solution
        cy.get('.post_comment_left').eq(1).find('.solution-btn').click();
        cy.get('.post_comment_left').eq(1).find('.solution-btn-icon-green').should('exist');
        cy.get('.post_comment_left').eq(1).find('.solution-btn-icon-transparent').should('not.exist');
    })

    it('A solution was previously chosen. Solution owner unclick the solution button.', () => {
        cy.visit('http://localhost:3000');
        // Log in as the question owner
        cy.contains('Sign In').click();
        cy.get('#formEmailInput').type('test1@gmail.com');
        cy.get('#formPasswordInput').type('test123');
        cy.get('.form_postBtn').click();
        // Find the post
        cy.contains('Programmatically navigate using React router').click();
        // Verify a solution was previously chosen
        cy.get('.post_comment_left').eq(1).find('.solution-btn-icon-green').should('exist');
        cy.get('.post_comment_left').eq(1).find('.solution-btn-icon-transparent').should('not.exist');
        // unmark as solution
        cy.get('.post_comment_left').eq(1).find('.solution-btn').click();
        cy.get('.post_comment_left').eq(1).find('.solution-btn-icon-green').should('not.exist');
        cy.get('.post_comment_left').eq(1).find('.solution-btn-icon-transparent').should('exist');
    })

    it('A solution was previously chosen. Solution owner click/mark another answer as solution.', () => {
        cy.visit('http://localhost:3000');
        // Log in as the question owner
        cy.contains('Sign In').click();
        cy.get('#formEmailInput').type('test1@gmail.com');
        cy.get('#formPasswordInput').type('test123');
        cy.get('.form_postBtn').click();
        // Find the post
        cy.contains('Programmatically navigate using React router').click();
        // Verify a solution was previously chosen
        cy.get('.post_comment_left').eq(1).find('.solution-btn-icon-green').should('exist');
        cy.get('.post_comment_left').eq(1).find('.solution-btn-icon-transparent').should('not.exist');
        // Mark another answer solution
        cy.get('.post_comment_left').eq(2).find('.solution-btn-icon-green').should('not.exist');
        cy.get('.post_comment_left').eq(2).find('.solution-btn-icon-transparent').should('exist');
        cy.get('.post_comment_left').eq(2).find('.solution-btn').click();
        // previous solution 
        cy.get('.post_comment_left').eq(1).find('.solution-btn-icon-green').should('not.exist');
        cy.get('.post_comment_left').eq(1).find('.solution-btn-icon-transparent').should('exist');
        // latest solution
        cy.get('.post_comment_left').eq(2).find('.solution-btn-icon-green').should('exist');
        cy.get('.post_comment_left').eq(2).find('.solution-btn-icon-transparent').should('not.exist');
    })
})
