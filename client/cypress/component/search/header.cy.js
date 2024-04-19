import Header from '../../../src/components/header';

it('header shows search bar, login button, and title', () => {
    const searchQuery = ''
    const loggedInUser = null;
    const csrfTokenMock = "MockCSRFToken";
    const setQuestionPageSpy = cy.spy().as('setQuestionPageSpy');
    const updateUserSpy = cy.spy().as('updateUserSpy');
    const updateAppStatusSpy = cy.spy().as('updateAppStatusSpy');
    const setCsrfTokenSpy = cy.spy().as('setCsrfTokenSpy');
    const title = 'Fake Stack Overflow';
    cy.mount(<Header 
                search={searchQuery}
                setQuestionPage={setQuestionPageSpy}
                updateAppStatus={updateAppStatusSpy}
                loggedIn={loggedInUser}
                updateUser={updateUserSpy}
                csrfToken={csrfTokenMock}
                setCsrfToken={setCsrfTokenSpy}
                />)
    cy.get('#searchBar').should('have.value', searchQuery)
    cy.get('#searchBar').should('have.attr', 'placeholder')
    cy.get('.title').contains(title)
    cy.get('.bluebtn').contains("Sign In");
})

it('search bar shows search text entered by user', () => {
    const searchQuery = 'test search';
    const loggedInUser = null;
    const csrfTokenMock = "MockCSRFToken";
    const setQuestionPageSpy = cy.spy().as('setQuestionPageSpy');
    const updateUserSpy = cy.spy().as('updateUserSpy');
    const updateAppStatusSpy = cy.spy().as('updateAppStatusSpy');
    const setCsrfTokenSpy = cy.spy().as('setCsrfTokenSpy');
    cy.mount(<Header
      search={searchQuery}
      setQuestionPage={setQuestionPageSpy}
      updateAppStatus={updateAppStatusSpy}
      loggedIn={loggedInUser}
      updateUser={updateUserSpy}
      csrfToken={csrfTokenMock}
      setCsrfToken={setCsrfTokenSpy}
    />)
    cy.get('#searchBar').should('have.value', searchQuery)
    cy.get('#searchBar').should('have.attr', 'placeholder');
    cy.get('#searchBar').clear()
    cy.get('#searchBar').type('Search change')
    cy.get('#searchBar').should('have.value', 'Search change')
})

it('set question page called when enter is pressed in search', () => {
    const searchQuery = 'test search';
    const loggedInUser = null;
    const csrfTokenMock = "MockCSRFToken";
    const setQuestionPageSpy = cy.spy().as('setQuestionPageSpy');
    const updateUserSpy = cy.spy().as('updateUserSpy');
    const updateAppStatusSpy = cy.spy().as('updateAppStatusSpy');
    const setCsrfTokenSpy = cy.spy().as('setCsrfTokenSpy');
    cy.mount(<Header
      search={searchQuery}
      setQuestionPage={setQuestionPageSpy}
      updateAppStatus={updateAppStatusSpy}
      loggedIn={loggedInUser}
      updateUser={updateUserSpy}
      csrfToken={csrfTokenMock}
      setCsrfToken={setCsrfTokenSpy}
    />)
    cy.get('#searchBar').type('{enter}')
    cy.get('@setQuestionPageSpy').should('have.been.calledWith', searchQuery, 'Search Results')
})
