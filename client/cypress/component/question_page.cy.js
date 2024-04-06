import QuestionHeader from '../../src/components/main/questionPage/header';
import OrderButton from '../../src/components/main/questionPage/header/orderButton';
import Question from '../../src/components/main/questionPage/question';

// Question Page - Order Button
it('Rendering Order Button', () => {
    const message = 'Test Message'
    const setQuestionOrderSpy = cy.spy('').as('setQuestionOrderSpy')
    
    cy.mount(<OrderButton 
        message={message} 
        setQuestionOrder={setQuestionOrderSpy}/>)
     cy.get('.btn').click()
     cy.get('@setQuestionOrderSpy').should('have.been.calledWith', message);

})

// Question Page - Header Component
it('Rendering Question Header', () => {
    const title = 'Sample Title'
    const count = 1
    const handleNewQuestionSpy = cy.spy().as('handleNewQuestionSpy')
    const setQuestionOrderSpy = cy.spy().as('setQuestionOrderSpy')
    
    cy.mount(<QuestionHeader 
        title_text={title} 
        qcnt = {count}
        setQuestionOrder={setQuestionOrderSpy}
        handleNewQuestion={handleNewQuestionSpy}/>)

    cy.get('.bold_title').contains(title)
    cy.get('.bluebtn').click()
    cy.get('@handleNewQuestionSpy').should('have.been.called');
    cy.get('#question_count').contains(count + ' questions')
    cy.get('.btns .btn').eq(0).should('have.text', 'Newest');
    cy.get('.btns .btn').eq(1).should('have.text', 'Active');
    cy.get('.btns .btn').eq(2).should('have.text', 'Unanswered');
    cy.get('.btns .btn').each(($el, index, $list) => {
        cy.wrap($el).click();
        cy.get('@setQuestionOrderSpy').should('have.been.calledWith', $el.text());
    })
})

// Question Body
it('Rendering Question Body', () => {
    const answers = []
    for(let index= 1; index <= 2; index++){
        var newanswer = {
            aid: index,
            text: 'Sample Answer Text '+index,
            ansBy: 'sampleanswereduser'+index,
            ansDate: new Date(),
        };
        answers.push(newanswer)
    }

    const tag1 = {name : 'Sample Tag 1', qcnt: 1}
    const tag2 = {name : 'Sample Tag 2', qcnt: 2}
    const tlist = [tag1, tag2]

    let question = {
        _id: '000fff111',
        title: 'Sample Question Title',
        text: 'Sample Question Text',
        asked_by: 'vanshitatilwani',
        ask_date_time: new Date('Jan 17, 2024 03:24'),
        views : 150,
        answers : answers,
        tags: tlist
    };

    const handleAnswerSpy = cy.spy().as('handleAnswerSpy')
    const clickTagSpy = cy.spy().as('clickTagSpy')
    
    cy.mount(<Question 
        q={question} 
        clickTag={clickTagSpy}
        handleAnswer={handleAnswerSpy}/>)

    cy.get('.postTitle').contains(question.title)
    cy.get('.postStats').contains(answers.length + ' answers')
    cy.get('.postStats').contains(question.views + ' views')
    cy.get('.question_tags .question_tag_button').contains('Sample Tag 1')
    cy.get('.question_tags .question_tag_button').contains('Sample Tag 2')
    cy.get('.lastActivity .question_author').contains(question.asked_by)
    cy.get('.lastActivity .question_meta').contains('asked Jan 17 at 03:24')
    
    for (let index = 0; index < tlist.length; index++) {
        cy.get(".question_tag_button").eq(index).click()
        cy.get('@clickTagSpy').should('have.been.calledWith', tlist[index].name);
    }

    cy.get('.question').click({ force: true })
    cy.get('@handleAnswerSpy').should('have.been.calledOnceWith', question._id)
})
