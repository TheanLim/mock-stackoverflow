import Header from '../../src/components/header/index';

it('header shows search bar and title', () => {
    const setQuestionPageSpy = cy.spy().as('setQuestionPageSpy')
    const searchQuery = ''
    const title = 'Fake Stack Overflow'
    cy.mount(<Header 
                search={searchQuery} 
                setQuestionPage={setQuestionPageSpy}/>)
    cy.get('#searchBar').should('have.value', searchQuery)
    cy.get('#searchBar').should('have.attr', 'placeholder')
    cy.get('.title').contains(title)
})

it('search bar shows search text entered by user', () => {
    const setQuestionPageSpy = cy.spy().as('setQuestionPageSpy')
    const searchQuery = 'test search'
    cy.mount(<Header 
                search={searchQuery} 
                setQuestionPage={setQuestionPageSpy}/>)
    cy.get('#searchBar').should('have.value', searchQuery)
    cy.get('#searchBar').should('have.attr', 'placeholder');
    cy.get('#searchBar').clear()
    cy.get('#searchBar').type('Search change')
    cy.get('#searchBar').should('have.value', 'Search change')
})

it('set question page called when enter is pressed in search', () => {
    const setQuestionPageSpy = cy.spy().as('setQuestionPageSpy')
    const searchQuery = 'test search'
    cy.mount(<Header 
                search={searchQuery} 
                setQuestionPage={setQuestionPageSpy}/>)
    cy.get('#searchBar').type('{enter}')
    cy.get('@setQuestionPageSpy').should('have.been.calledWith', searchQuery, 'Search Results')
})
