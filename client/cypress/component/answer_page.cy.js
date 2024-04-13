import AnswerHeader from '../../src/components/main/answerPage/header';
import QuestionBody from '../../src/components/main/answerPage/questionBody'
import Answer from '../../src/components/main/answerPage/answer';
import AnswerPage from '../../src/components/main/answerPage'

// Answer Page - Header Tests
it('Answer Header component shows question title, answer count and onclick function', () => {
    const answerCount = 3;
    const title = 'android studio save string shared preference, start activity and load the saved string';
    const handleNewQuestion = cy.spy().as('handleNewQuestionSpy');
    
    cy.mount(<AnswerHeader 
        ansCount={answerCount} 
        title={title}
        handleNewQuestion={handleNewQuestion}/>);
    cy.get('.bold_title').contains(answerCount + " answers");
    cy.get('.answer_question_title').contains(title);
    cy.get('.bluebtn').click();
    cy.get('@handleNewQuestionSpy').should('have.been.called');
})

// Answer Page - Question Body
it('Component should have a question body which shows question text, views, asked by and asked', () => {
    const questionBody = 'Sample Question Body';
    const views = '150';
    const askedBy = {display_name: 'vanshitatilwani'};
    const date = new Date().toLocaleString();
    cy.mount(<QuestionBody 
        text={questionBody}
        views={views} 
        askby={askedBy}
        meta={date}
        />);
    
    cy.get('.answer_question_text > div').contains(questionBody)
    cy.get('.answer_question_view').contains(views + ' views')
    cy.get('.answer_question_right > .question_author').contains(askedBy.display_name);
    cy.get('.answer_question_right > .answer_question_meta').contains('asked ' + date)
    
})

// Answer Page - Answer component
it('Component should have a answer text ,answered by and answered date', () => {
    const answerText = 'Sample Answer Text'
    const answeredBy = {display_name: 'mkrstulovic'}
    const date = new Date().toLocaleString()
    cy.mount(<Answer 
        text={answerText}
        ansBy={answeredBy}
        meta={date}
        />)
    
    cy.get('.answerText').contains(answerText)
    cy.get('.answerAuthor > .answer_author').contains(answeredBy.display_name)
    cy.get('.answerAuthor > .answer_question_meta').contains(date)
    
    
})

// Anwer Page  - Main Component
it('Render a Answer Page Component and verify all details', () => {
    const handleNewQuestion = cy.spy().as('handleNewQuestionSpy')
    const handleNewAnswer = cy.spy().as('handleNewAnswerSpy') 

    const question = {
        id: 1,
        title: 'How to test React components?',
        text: 'I want to learn how to test React components using Jest and Enzyme.',
        asked_by: {display_name: 'John Doe'},
        ask_date_time: '2023-04-03T12:00:00Z',
        views: 10,
        answers: [
          {
            text: 'You can use Jest as a test runner and Enzyme for rendering and traversing React components.',
            ans_by: {display_name: 'Jane Smith'},
            ans_date_time: '2023-04-03T13:00:00Z',
          },
          {
            text: 'You can use Jest as a test runner and Enzyme for rendering and traversing React components.',
            ans_by: {display_name: 'Jane Smith'},
            ans_date_time: '2023-04-03T13:00:00Z',
          },
        ],
      };
    
    cy.stub(AnswerPage, 'getQuestionById').as('getQuestionByIdStub').resolves(question);

    cy.mount(<AnswerPage 
        qid={question.id}
        handleNewQuestion={handleNewQuestion}
        handleNewAnswer={handleNewAnswer}
    />)
    
    cy.get('@getQuestionByIdStub').should('have.been.called', question.id);
    cy.get('.bold_title').contains(question.answers.length + " answers")
    cy.get('.answer_question_title').contains(question.title)
    cy.get('#answersHeader > .bluebtn').click()
    cy.get('@handleNewQuestionSpy').should('have.been.called');

    cy.get('.answer_question_text > div').contains(question.text)
    cy.get('.answer_question_view').contains(question.views + ' views')
    cy.get('.answer_question_right > .question_author').contains(question.asked_by.display_name)
    
    cy.get('.answerText')
    .eq(0)
    .find('div')
    .should('have.text', question.answers[0].text);
    cy.get('.answerAuthor > .answer_author').eq(0).should('have.text',
      question.answers[0].ans_by.display_name)

    cy.get('.answerText')
    .eq(1) 
    .find('div')
    .should('have.text', question.answers[1].text);
    cy.get('.answerAuthor > .answer_author').eq(0).should('have.text',
      question.answers[0].ans_by.display_name)

    cy.get('.ansButton').click();
    cy.get('@handleNewAnswerSpy').should('have.been.called');
    
})
