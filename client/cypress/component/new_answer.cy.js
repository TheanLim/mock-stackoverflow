import NewAnswer from '../../src/components/main/newAnswer/index';

it('mounts', () => {
    cy.mount(<NewAnswer/>)
    cy.get('#answerUsernameInput')
    cy.get('#answerTextInput')
    cy.get('.form_postBtn')
})

it('shows error message when both input is empty', () => {
    cy.mount(<NewAnswer/>)
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('Username cannot be empty')
    cy.get('div .input_error').contains('Answer text cannot be empty')
})

it('shows username inputted by user', () => {
    cy.mount(<NewAnswer/>)
    cy.get('#answerUsernameInput').should('have.value', '')
    cy.get('#answerUsernameInput').type('abc')
    cy.get('#answerUsernameInput').should('have.value', 'abc')
})

it('shows error message when text is empty', () => {
    cy.mount(<NewAnswer/>)
    cy.get('#answerUsernameInput').type('abc')
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('Answer text cannot be empty')
})

it('shows text inputted by user', () => {
    cy.mount(<NewAnswer/>)
    cy.get('#answerTextInput').should('have.value', '')
    cy.get('#answerTextInput').type('abc')
    cy.get('#answerTextInput').should('have.value', 'abc')
})


it('addAnswer is called when click Post Answer', () => {
    const qid = 123;
    const answer = {
        text: 'abc',
        ans_by: 'usr',
        ans_date_time: new Date(),
        score: 0,
    };
    
    cy.stub(NewAnswer, 'validateHyperlink').returns(true);
    cy.stub(NewAnswer, 'addAnswer').as('addAnswerStub').resolves({_id:"0000ffff", ...answer});

    cy.mount(<NewAnswer qid={qid} handleAnswer={()=>{}} />)

    cy.get('#answerUsernameInput').type('usr')
    cy.get('#answerTextInput').type('abc')
    cy.get('.form_postBtn').click();
    cy.get('@addAnswerStub').should('have.been.calledWith', qid, answer);

})

it('handleAnswer is called when click Post Answer', () => {
    const handleAnswer = cy.spy().as('handleAnswerSpy')
    const qid = 123;
    const answer = {
        text: 'abc',
        ans_by: 'usr',
        ans_date_time: new Date(),
        score: 0,
    };

    cy.stub(NewAnswer, 'validateHyperlink').returns(true);
    cy.stub(NewAnswer, 'addAnswer').as('addAnswerStub').resolves({_id:"0000ffff", ...answer});

    cy.mount(<NewAnswer qid={qid} handleAnswer={handleAnswer} />)
    
    cy.get('#answerUsernameInput').type('usr')
    cy.get('#answerTextInput').type('abc')
    cy.get('.form_postBtn').click();
    cy.get('@addAnswerStub').should('have.been.calledWith', qid, answer);
    cy.get('@handleAnswerSpy').should('have.been.calledWith', 123)
})
