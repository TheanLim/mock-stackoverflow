import Header from '../../src/components/header/index';

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

it('updateAppStatus is called when click Sign In', () => {
    const searchQuery = 'test search';
    const newStatus = 'started_login';
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
    cy.get('.bluebtn').click();
    cy.get('@updateAppStatusSpy').should('have.been.calledWith', newStatus);
})

it('shows profile and sign out buttons if logged in', () => {
    const searchQuery = 'test search';
    const loggedInUser = 'logged_in';
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
    cy.get('.bluebtn').contains("Sign Out");
    cy.get('.bluebtn').contains("Profile");
})

it('logOutUser is called when click Sign Out', () => {
    const searchQuery = 'test search';
    const loggedInUser = 'logged_in';
    const csrfTokenMock = "MockCSRFToken";
    const setQuestionPageSpy = cy.spy().as('setQuestionPageSpy');
    const updateUserSpy = cy.spy().as('updateUserSpy');
    const updateAppStatusSpy = cy.spy().as('updateAppStatusSpy');
    const setCsrfTokenSpy = cy.spy().as('setCsrfTokenSpy');

    cy.stub(Header, 'logOutUser').as('logOutUserStub').resolves({message: 'Session deleted successfully'});

    cy.mount(<Header
      search={searchQuery}
      setQuestionPage={setQuestionPageSpy}
      updateAppStatus={updateAppStatusSpy}
      loggedIn={loggedInUser}
      updateUser={updateUserSpy}
      csrfToken={csrfTokenMock}
      setCsrfToken={setCsrfTokenSpy}
    />)
    cy.get('.bluebtn').contains("Sign Out").click();
    cy.get('@logOutUserStub').should('have.been.called');
})

it('updateAppStatus is called when click Sign Out', () => {
    const searchQuery = 'test search';
    const newStatus = 'logging_out';
    const loggedInUser = 'logged_in';
    const csrfTokenMock = "MockCSRFToken";
    const setQuestionPageSpy = cy.spy().as('setQuestionPageSpy');
    const updateUserSpy = cy.spy().as('updateUserSpy');
    const updateAppStatusSpy = cy.spy().as('updateAppStatusSpy');
    const setCsrfTokenSpy = cy.spy().as('setCsrfTokenSpy');
    cy.stub(Header, 'logOutUser').as('logOutUserStub').resolves({message: 'Session deleted successfully'});

    cy.mount(<Header
      search={searchQuery}
      setQuestionPage={setQuestionPageSpy}
      updateAppStatus={updateAppStatusSpy}
      loggedIn={loggedInUser}
      updateUser={updateUserSpy}
      csrfToken={csrfTokenMock}
      setCsrfToken={setCsrfTokenSpy}
    />)
    cy.get('.bluebtn').contains("Sign Out").click();
    cy.get('@logOutUserStub').should('have.been.called');
    cy.get('@updateAppStatusSpy').should('have.been.calledWith', newStatus);
})

it('updateAppStatus is called when click Profile', () => {
    const searchQuery = 'test search';
    const newStatus = 'viewing_self_profile';
    const loggedInUser = 'logged_in';
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
    cy.get('.bluebtn').contains("Profile").click();
    cy.get('@updateAppStatusSpy').should('have.been.calledWith', newStatus);
})

it('updateUser is called when click Sign Out', () => {
    const searchQuery = 'test search';
    const loggedInUser = 'logged_in';
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
    cy.get('.bluebtn').contains("Sign Out").click();
    cy.get('@updateUserSpy').should('have.been.calledWith', null);
})

it('setCsrfToken is called when click Sign Out', () => {
    const searchQuery = 'test search';
    const loggedInUser = 'logged_in';
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
    cy.get('.bluebtn').contains("Sign Out").click();
    cy.get('@setCsrfTokenSpy').should('have.been.calledWith', "");
})
