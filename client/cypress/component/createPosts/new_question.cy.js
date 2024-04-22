import NewQuestion from '../../../src/components/main/newQuestion';

it('mounts', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTitleInput')
    cy.get('#formTextInput')
    cy.get('#formTagInput')
    cy.get('.form_postBtn')
})

it('shows title inputted by user', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTitleInput').should('have.value', '')
    cy.get('#formTitleInput').type('abc')
    cy.get('#formTitleInput').should('have.value', 'abc')
})

it('shows text inputted by user', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTextInput').should('have.value', '')
    cy.get('#formTextInput').type('abc')
    cy.get('#formTextInput').should('have.value', 'abc')
})

it('shows tags inputted by user', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTagInput').should('have.value', '')
    cy.get('#formTagInput').type('abc')
    cy.get('#formTagInput').should('have.value', 'abc')
})

it('shows error message when inputs are empty', () => {
    cy.mount(<NewQuestion/>)
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('Title cannot be empty')
    cy.get('div .input_error').contains('Question text cannot be empty')
    cy.get('div .input_error').contains('Should have at least 1 tag')
})

it('shows error message when title is more than 100 characters', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTitleInput').type('a'.repeat(101))
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('Title cannot be more than 100 characters')
})

it('shows error message when there are more than five tags', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTagInput').type('a b c d e f')
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('Cannot have more than 5 tags')
})

it('shows error message when a tag is longer than 20 characters', () => {
    cy.mount(<NewQuestion/>)
    cy.get('#formTagInput').type('a'.repeat(21))
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('New tag length cannot be more than 20')
})

it('addQuestion is called when click Post Question', () => {    
    const question = {
        title: 'title1',
        text: 'question1',
        tags: ['tag1', 'tag2'],
        ask_date_time: new Date(),
        status: 'open',
        score: 0,
    };

    cy.stub(NewQuestion, 'validateHyperlink').returns(true);
    cy.stub(NewQuestion, 'addQuestion').as('addQuestionStub').resolves({_id:"0000ffff", ...question});

    cy.mount(<NewQuestion handleQuestions={() => {}} />)

    cy.get('#formTitleInput').type('title1')
    cy.get('#formTextInput').type('question1')
    cy.get('#formTagInput').type('tag1 tag2')
    cy.get('.form_postBtn').click();
    cy.get('@addQuestionStub').should('have.been.calledWith', question);
})

it('addQuestion is called when click Post Question and shows error when not enough rep to make new tag', () => {
    const question = {
        title: 'title1',
        text: 'question1',
        tags: ['tag1', 'tag2'],
        ask_date_time: new Date(),
        status: 'open',
        score: 0,
    };

    cy.stub(NewQuestion, 'validateHyperlink').returns(true);
    cy.stub(NewQuestion, 'addQuestion').as('addQuestionStub')
      .resolves({error:"Not enough reputation to create new tags."});

    cy.mount(<NewQuestion handleQuestions={() => {}} />)

    cy.get('#formTitleInput').type('title1')
    cy.get('#formTextInput').type('question1')
    cy.get('#formTagInput').type('tag1 tag2')
    cy.get('.form_postBtn').click();
    cy.get('@addQuestionStub').should('have.been.calledWith', question);
    cy.get('div .input_error').contains('Not enough reputation to create new tags.')
})

it('handleQuestion is called when click Post Question', () => {
    const handleQuestionsSpy = cy.spy().as('handleQuestionsSpy')
    
    const question = {
        title: 'title1',
        text: 'question1',
        tags: ['tag1', 'tag2'],
        ask_date_time: new Date(),
        status: 'open',
        score: 0,
    };

    cy.stub(NewQuestion, 'validateHyperlink').returns(true);
    cy.stub(NewQuestion, 'addQuestion').as('addQuestionStub').resolves({_id:"0000ffff", ...question});

    cy.mount(<NewQuestion handleQuestions={handleQuestionsSpy} />)

    cy.get('#formTitleInput').type('title1')
    cy.get('#formTextInput').type('question1')
    cy.get('#formTagInput').type('tag1 tag2')
    cy.get('.form_postBtn').click();
    cy.get('@addQuestionStub').should('have.been.calledWith', question);
    cy.get('@handleQuestionsSpy').should('have.been.calledOnce');
})

it('validateHyperlink is called when click Post Question', () => {
    const handleQuestionsSpy = cy.spy().as('handleQuestionsSpy')

    const question = {
        title: 'title1',
        text: 'question1',
        tags: ['tag1', 'tag2'],
        ask_date_time: new Date(),
        status: 'open',
        score: 0,
    };

    cy.stub(NewQuestion, 'validateHyperlink').as('validateHyperlinkStub').returns(true);
    cy.stub(NewQuestion, 'addQuestion').as('addQuestionStub').resolves({_id:"0000ffff", ...question});

    cy.mount(<NewQuestion handleQuestions={handleQuestionsSpy} />)

    cy.get('#formTitleInput').type('title1')
    cy.get('#formTextInput').type('question1')
    cy.get('#formTagInput').type('tag1 tag2')
    cy.get('.form_postBtn').click();
    cy.get('@validateHyperlinkStub').should('have.been.calledWith', question.text)
    cy.get('@addQuestionStub').should('have.been.calledWith', question);
    cy.get('@handleQuestionsSpy').should('have.been.calledOnce');
})

it('validateHyperlink is called when click Post Question', () => {
    const handleQuestionsSpy = cy.spy().as('handleQuestionsSpy')

    const question = {
        title: 'title1',
        text: 'question1',
        tags: ['tag1', 'tag2'],
        ask_date_time: new Date(),
        status: 'open',
        score: 0,
    };

    cy.stub(NewQuestion, 'validateHyperlink').as('validateHyperlinkStub').returns(false);
    cy.stub(NewQuestion, 'addQuestion').as('addQuestionStub').resolves({_id:"0000ffff", ...question});

    cy.mount(<NewQuestion handleQuestions={handleQuestionsSpy} />)

    cy.get('#formTitleInput').type('title1')
    cy.get('#formTextInput').type('question1')
    cy.get('#formTagInput').type('tag1 tag2')
    cy.get('.form_postBtn').click();
    cy.get('@validateHyperlinkStub').should('have.been.calledWith', question.text)
    cy.get('div .input_error').contains('Invalid hyperlink format.');
})
