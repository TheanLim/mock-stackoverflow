import React from 'react'
import Login from '../../../src/components/main/login'

it('mounts', () => {
  cy.stub(Login, 'fetchCSRF').as('fetchCSRFStub').resolves("MockCSRFToken");
  cy.stub(Login, 'checkLoginStatus').as('checkLoginStatusStub').resolves("MockUser");
  cy.mount(<Login
    handleRedirect={() => {}}
    handleRegister={() => {}}
    setCsrfToken={() => {}}
    csrfToken="MockCSRFToken"
    updateUser={() => {}}/>)
  cy.get('#formEmailInput')
  cy.get('#formPasswordInput')
  cy.get('.form_postBtn')
  cy.get('.bluebtn')
})

it('shows email inputted by user', () => {
  cy.stub(Login, 'fetchCSRF').as('fetchCSRFStub').resolves("MockCSRFToken");
  cy.stub(Login, 'checkLoginStatus').as('checkLoginStatusStub').resolves("MockUser");
  cy.mount(<Login
    handleRedirect={() => {}}
    handleRegister={() => {}}
    setCsrfToken={() => {}}
    csrfToken="MockCSRFToken"
    updateUser={() => {}}/>)
  cy.get('#formEmailInput').should('have.value', '')
  cy.get('#formEmailInput').type('abc')
  cy.get('#formEmailInput').should('have.value', 'abc')
})

it('shows password inputted by user', () => {
  cy.stub(Login, 'fetchCSRF').as('fetchCSRFStub').resolves("MockCSRFToken");
  cy.stub(Login, 'checkLoginStatus').as('checkLoginStatusStub').resolves("MockUser");
  cy.mount(<Login
    handleRedirect={() => {}}
    handleRegister={() => {}}
    setCsrfToken={() => {}}
    csrfToken="MockCSRFToken"
    updateUser={() => {}}/>)
  cy.get('#formPasswordInput').should('have.value', '')
  cy.get('#formPasswordInput').type('abc')
  cy.get('#formPasswordInput').should('have.value', 'abc')
})

it('shows error message when inputs are empty', () => {
  const setCsrfTokenSpy = cy.spy().as('setCsrfTokenSpy');
  cy.stub(Login, 'fetchCSRF').as('fetchCSRFStub').resolves("MockCSRFToken");
  cy.stub(Login, 'checkLoginStatus').as('checkLoginStatusStub').resolves("MockUser");
  cy.mount(<Login
    handleRedirect={() => {}}
    handleRegister={() => {}}
    setCsrfToken={setCsrfTokenSpy}
    csrfToken=""
    updateUser={() => {}}/>)
  cy.get('.form_postBtn').click()
  cy.get('div .input_error').contains('You must enter an email.')
  cy.get('div .input_error').contains('You must enter a password.')
})

it('shows error message when email is in invalid format', () => {
  const setCsrfTokenSpy = cy.spy().as('setCsrfTokenSpy');
  cy.stub(Login, 'fetchCSRF').as('fetchCSRFStub').resolves("MockCSRFToken");
  cy.stub(Login, 'checkLoginStatus').as('checkLoginStatusStub').resolves("MockUser");
  cy.mount(<Login
    handleRedirect={() => {}}
    handleRegister={() => {}}
    setCsrfToken={setCsrfTokenSpy}
    csrfToken=""
    updateUser={() => {}}/>)
  cy.get('#formEmailInput').type('a')
  cy.get('.form_postBtn').click()
  cy.get('div .input_error').contains('Invalid Email Format.')
})

it('calls fetchCSRFToken and setCSRFToken if one is not provided', () => {
  const setCsrfTokenSpy = cy.spy().as('setCsrfTokenSpy');
  cy.stub(Login, 'fetchCSRF').as('fetchCSRFStub').resolves("MockCSRFToken");
  cy.stub(Login, 'checkLoginStatus').as('checkLoginStatusStub').resolves("MockUser");

  cy.mount(<Login
    handleRedirect={() => {}}
    handleRegister={() => {}}
    setCsrfToken={setCsrfTokenSpy}
    csrfToken=""
    updateUser={() => {}}/>)

  cy.get('@fetchCSRFStub').should('have.been.calledOnce');
  cy.get('@setCsrfTokenSpy').should('have.been.calledWith', "MockCSRFToken");
})

it('calls checkLoginStatus if csrfToken is not provided', () => {
  const updateUserSpy = cy.spy().as('updateUserSpy');
  const setCsrfTokenSpy = cy.spy().as('setCsrfTokenSpy');
  cy.stub(Login, 'fetchCSRF').as('fetchCSRFStub').resolves("MockCSRFToken");
  cy.stub(Login, 'checkLoginStatus').as('checkLoginStatusStub').resolves({user: "MockUser"});

  cy.mount(<Login
    handleRedirect={() => {}}
    handleRegister={() => {}}
    setCsrfToken={setCsrfTokenSpy}
    csrfToken=""
    updateUser={updateUserSpy}/>)

  cy.get('@fetchCSRFStub').should('have.been.calledOnce');
  cy.get('@setCsrfTokenSpy').should('have.been.calledWith', "MockCSRFToken");
  cy.get('@checkLoginStatusStub').should('have.been.calledOnce');
  cy.get('@updateUserSpy').should('have.been.calledWith', "MockUser");
})

it('getExistingUser is called when click Login', () => {
  const login = {
    email: 'test1@gmail.com',
    password: 'test123',
  };

  cy.stub(Login, 'getExistingUser').as('getExistingUserStub').resolves({message: "Successfully logged in."});

  cy.mount(<Login
    handleRedirect={() => {}}
    handleRegister={() => {}}
    setCsrfToken={() => {}}
    csrfToken="MockCSRFToken"
    updateUser={() => {}}/>)


  cy.get('#formEmailInput').type('test1@gmail.com')
  cy.get('#formPasswordInput').type('test123')
  cy.get('.form_postBtn').click();
  cy.get('@getExistingUserStub').should('have.been.calledWith', login.email, login.password);
})

it('updateUser is called when click Login', () => {
  const handleRedirectSpy = cy.spy().as('handleRedirectSpy');
  const setCsrfTokenSpy = cy.spy().as('setCsrfTokenSpy');
  const updateUserSpy = cy.spy().as('updateUserSpy');
  const login = {
    email: 'test1@gmail.com',
    password: 'test123',
  };

  cy.stub(Login, 'fetchCSRF').as('fetchCSRFStub').resolves("MockCSRFToken");
  cy.stub(Login, 'checkLoginStatus').as('checkLoginStatusStub').resolves(null);
  cy.stub(Login, 'getExistingUser').as('getExistingUserStub').resolves({user: "MockUser"});

  cy.mount(<Login
    handleRedirect={handleRedirectSpy}
    handleRegister={() => {}}
    setCsrfToken={setCsrfTokenSpy}
    csrfToken=""
    updateUser={updateUserSpy}/>)

  cy.get('#formEmailInput').type('test1@gmail.com');
  cy.get('#formPasswordInput').type('test123');
  cy.get('.form_postBtn').click();
  cy.get('@getExistingUserStub').should('have.been.calledWith', login.email, login.password);
  cy.get('@updateUserSpy').should('have.been.calledWith', "MockUser");
})

it('handleRegister is called when click Register', () => {
  const handleRegisterSpy = cy.spy().as('handleRegisterSpy')
  const setCsrfTokenSpy = cy.spy().as('setCsrfTokenSpy');
  cy.stub(Login, 'fetchCSRF').as('fetchCSRFStub').resolves("MockCSRFToken");
  cy.stub(Login, 'checkLoginStatus').as('checkLoginStatusStub').resolves(null);

  cy.mount(<Login
    handleRedirect={() => {}}
    handleRegister={handleRegisterSpy}
    setCsrfToken={setCsrfTokenSpy}
    csrfToken="MockCSRFToken"
    updateUser={() => {}}/>)

  cy.get('#formEmailInput').type('test1@gmail.com')
  cy.get('#formPasswordInput').type('test123')
  cy.get('.bluebtn').click();
  cy.get('@handleRegisterSpy').should('have.been.calledOnce');
})

