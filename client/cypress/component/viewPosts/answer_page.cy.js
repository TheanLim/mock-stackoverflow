import AnswerHeader from '../../../src/components/main/answerPage/header';
import Post from '../../../src/components/main/answerPage/post';
import AnswerPage from '../../../src/components/main/answerPage'

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
    cy.mount(<Post 
              postType={'question'}
              text={questionBody}
              views={views} 
              postBy={askedBy}
              meta={date}
          />)
    
    cy.get('#postText > div').contains(questionBody)
    cy.get('.post_view').contains(views + ' views')
    cy.get('.post_author').contains(askedBy.display_name);
    cy.get('.post_question_meta').contains('asked ' + date)
    
})

// Answer Page - Answer component
it('Component should have a answer text ,answered by and answered date', () => {
    const answerText = 'Sample Answer Text'
    const answeredBy = {display_name: 'mkrstulovic'}
    const date = new Date().toLocaleString()
    cy.mount(<Post 
              text={answerText}
              postBy={answeredBy}
              meta={date}
    />)
    
    cy.get('#postText > div').contains(answerText)
    cy.get('.post_author').contains(answeredBy.display_name)
    cy.get('.post_question_meta').contains(date)
    
    
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
        status: 'open',
        answers: [
          {
            text: 'You can use Jest as a test runner and Enzyme for rendering and traversing React components.',
            ans_by: {display_name: 'Jane Smith'},
            ans_date_time: new Date('2023-04-03T13:00:00Z'),
            score: 10
          },
          {
            text: 'You can use Jest as a test runner and Enzyme for rendering and traversing React components.',
            ans_by: {display_name: 'Jane Smith'},
            ans_date_time: new Date('2023-04-03T13:00:00Z'),
            score: 10
          },
          {
            text: 'Test Sorting - newest but score 0',
            ans_by: {display_name: 'sorter'},
            ans_date_time:  new Date('2024-01-01T13:00:00Z'),
            score:0
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

    cy.get('.post > div').contains(question.text)
    cy.get('.post_view').contains(question.views + ' views')
    cy.get('.post_author').contains(question.asked_by.display_name)
    
    cy.get('.post > #postText')
    .eq(1)
    .find('div')
    .should('have.text', question.answers[0].text);
    cy.get('.post_author').eq(1).should('have.text',
      question.answers[0].ans_by.display_name)

    cy.get('.post > #postText')
    .eq(2)
    .find('div')
    .should('have.text', question.answers[0].text);
    cy.get('.post_author').eq(2).should('have.text',
      question.answers[0].ans_by.display_name)

    // Sort post answers
    cy.get('.sort_answers').contains('newest').click();
    cy.get('.post > #postText')
    .eq(1)
    .find('div')
    .should('have.text', question.answers[0].text);
    cy.get('.post_author').eq(1).should('have.text',
      question.answers[0].ans_by.display_name)

    cy.get('.ansButton').click();
    cy.get('@handleNewAnswerSpy').should('have.been.called');
    
})
