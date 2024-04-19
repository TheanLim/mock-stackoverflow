import Tag from '../../../src/components/main/tagPage/tag';
import TagPage from '../../../src/components/main/tagPage'

// Tag Component
it('Rendering Tag Component', () => {
    const tag = {name : 'Sample Tag', qcnt: 10}
    const clickTag = cy.spy().as('clickTagSpy');
    
    cy.mount(<Tag 
        t={tag} 
        clickTag={clickTag}
        />)

    cy.get('.tagNode > .tagName').contains(tag.name)
    cy.get('div.tagNode').invoke('text').then((text) => {
        expect(text).to.equal(tag.name + tag.qcnt + ' questions');
    })
    cy.get('.tagNode').click()
    cy.get('@clickTagSpy').should('have.been.calledOnceWith', tag.name);
})

// Tag Page Component
it('Rendering Tag Page Component', () => {
    const tag1 = {name : 'Sample Tag 1', qcnt: 1}
    const tag2 = {name : 'Sample Tag 2', qcnt: 2}
    const tlist = [tag1, tag2]

    const clickTag = (name) => console.log('Clicked on clickTag '+name)
    const onClickText = 'Ask a question'
    const handleNewQuestion = () => console.log(onClickText)

    cy.window().then((win) => {
        cy.spy(win.console, 'log').as('consoleLogSpy');
    });  

    // Intercept the GET request for tags
    cy.stub(TagPage, 'getTagsWithQuestionNumber').as('getTagsWithQuestionNumberStub').resolves(tlist);

    cy.mount(<TagPage 
        clickTag={clickTag}
        handleNewQuestion = {handleNewQuestion}/>)

    cy.get('@getTagsWithQuestionNumberStub').should('have.been.called');
    
    cy.get('.bold_title').contains(tlist.length + ' Tags')
    cy.get('.bluebtn').click()
    cy.get('@consoleLogSpy').should('have.been.called');
    cy.get('@consoleLogSpy').then(consoleLogSpy => {
        expect(consoleLogSpy).to.have.been.calledWith(onClickText);
    });
    cy.get('.tagNode > .tagName').contains(tag1.name)
    cy.get('.tagNode > .tagName').contains(tag2.name)
    cy.get('div.tagNode').invoke('text').then((text) => {
        expect(text).to.equal(tag1.name + tag1.qcnt + ' questions' + tag2.name + tag2.qcnt + ' questions');
    })
})
