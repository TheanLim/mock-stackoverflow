import React from 'react'
import Register from '../../src/components/main/register'

it('mounts', () => {
  cy.mount(<Register
    handleRedirect={() => {}}
    handleLogin={() => {}}
    updateUser={() => {}}
    csrfToken="MockCSRFToken"
    setCsrfToken={() => {}}
  />)
  cy.get('#formEmailInput')
  cy.get('#formPasswordInput')
  cy.get('#formUsernameInput')
  cy.get('#formFirstNameInput')
  cy.get('#formLastNameInput')
  cy.get('.form_postBtn')
  cy.get('.bluebtn')
})

it('shows email inputted by user', () => {
  cy.mount(<Register
    handleRedirect={() => {}}
    handleLogin={() => {}}
    updateUser={() => {}}
    csrfToken="MockCSRFToken"
    setCsrfToken={() => {}}
  />)
  cy.get('#formEmailInput').should('have.value', '')
  cy.get('#formEmailInput').type('abc')
  cy.get('#formEmailInput').should('have.value', 'abc')
})

it('shows password inputted by user', () => {
  cy.mount(<Register
    handleRedirect={() => {}}
    handleLogin={() => {}}
    updateUser={() => {}}
    csrfToken="MockCSRFToken"
    setCsrfToken={() => {}}
  />)
  cy.get('#formPasswordInput').should('have.value', '')
  cy.get('#formPasswordInput').type('abc')
  cy.get('#formPasswordInput').should('have.value', 'abc')
})

it('shows username inputted by user', () => {
  cy.mount(<Register
    handleRedirect={() => {}}
    handleLogin={() => {}}
    updateUser={() => {}}
    csrfToken="MockCSRFToken"
    setCsrfToken={() => {}}
  />)
  cy.get('#formUsernameInput').should('have.value', '')
  cy.get('#formUsernameInput').type('abc')
  cy.get('#formUsernameInput').should('have.value', 'abc')
})

it('shows first name inputted by user', () => {
  cy.mount(<Register
    handleRedirect={() => {}}
    handleLogin={() => {}}
    updateUser={() => {}}
    csrfToken="MockCSRFToken"
    setCsrfToken={() => {}}
  />)
  cy.get('#formFirstNameInput').should('have.value', '')
  cy.get('#formFirstNameInput').type('abc')
  cy.get('#formFirstNameInput').should('have.value', 'abc')
})

it('shows last name inputted by user', () => {
  cy.mount(<Register
    handleRedirect={() => {}}
    handleLogin={() => {}}
    updateUser={() => {}}
    csrfToken="MockCSRFToken"
    setCsrfToken={() => {}}
  />)
  cy.get('#formLastNameInput').should('have.value', '')
  cy.get('#formLastNameInput').type('abc')
  cy.get('#formLastNameInput').should('have.value', 'abc')
})

it('shows error message when inputs are empty', () => {
  cy.mount(<Register
    handleRedirect={() => {}}
    handleLogin={() => {}}
    updateUser={() => {}}
    csrfToken="MockCSRFToken"
    setCsrfToken={() => {}}
  />)
  cy.get('.form_postBtn').click()
  cy.get('div .input_error').contains('Your email is required.')
  cy.get('div .input_error').contains('Your password is required.')
  cy.get('div .input_error').contains('Your display name is required.')
  cy.get('div .input_error').contains('Your first name is required.')
  cy.get('div .input_error').contains('Your last name is required.')

})

it('shows error message when email is in invalid format', () => {
  cy.mount(<Register
    handleRedirect={() => {}}
    handleLogin={() => {}}
    updateUser={() => {}}
    csrfToken="MockCSRFToken"
    setCsrfToken={() => {}}
  />)
  cy.get('#formEmailInput').type('a')
  cy.get('.form_postBtn').click()
  cy.get('div .input_error').contains('Invalid Email Format.')
})

it('calls fetchCSRFToken and setCSRFToken if one is not provided', () => {
  const setCsrfTokenSpy = cy.spy().as('setCsrfTokenSpy');
  cy.stub(Register, 'fetchCSRF').as('fetchCSRFStub').resolves("MockCSRFToken");
  cy.stub(Register, 'checkLoginStatus').as('checkLoginStatusStub').resolves("MockUser");

  cy.mount(<Register
    handleRedirect={() => {}}
    handleLogin={() => {}}
    setCsrfToken={setCsrfTokenSpy}
    csrfToken=""
    updateUser={() => {}}/>)

  cy.get('@fetchCSRFStub').should('have.been.calledOnce');
  cy.get('@setCsrfTokenSpy').should('have.been.calledWith', "MockCSRFToken");
})

it('calls checkLoginStatus if csrfToken is not provided', () => {
  const updateUserSpy = cy.spy().as('updateUserSpy');
  const setCsrfTokenSpy = cy.spy().as('setCsrfTokenSpy');
  cy.stub(Register, 'fetchCSRF').as('fetchCSRFStub').resolves("MockCSRFToken");
  cy.stub(Register, 'checkLoginStatus').as('checkLoginStatusStub').resolves({user: "MockUser"});

  cy.mount(<Register
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

it('registerNewUser is called when click Register', () => {
  const user = {
    email: 'test@gmail.com',
    password: 'test123',
    display_name: 'test',
    first_name: 'Test',
    last_name: 'User',
  }

  cy.stub(Register, 'registerNewUser').as('registerNewUserStub').resolves({message: "Successfully created a new user"});

  cy.mount(<Register
    handleRedirect={() => {}}
    handleLogin={() => {}}
    updateUser={() => {}}
    csrfToken="MockCSRFToken"
    setCsrfToken={() => {}}
  />)

  cy.get('#formEmailInput').type('test@gmail.com')
  cy.get('#formPasswordInput').type('test123')
  cy.get('#formUsernameInput').type('test')
  cy.get('#formFirstNameInput').type('Test')
  cy.get('#formLastNameInput').type('User')
  cy.get('.form_postBtn').click();
  cy.get('@registerNewUserStub').should('have.been.calledWith', user);
})

it('handleRedirect is called when click Register', () => {
  const handleRedirectSpy = cy.spy().as('handleRedirectSpy')
  const user = {
    email: 'test@gmail.com',
    password: 'test123',
    display_name: 'test',
    first_name: 'Test',
    last_name: 'User',
  }

  cy.stub(Register, 'registerNewUser').as('registerNewUserStub').resolves({message: "Successfully created a new user"});

  cy.mount(<Register
    handleRedirect={handleRedirectSpy}
    handleLogin={() => {}}
    updateUser={() => {}}
    csrfToken="MockCSRFToken"
    setCsrfToken={() => {}}
  />)

  cy.get('#formEmailInput').type('test@gmail.com')
  cy.get('#formPasswordInput').type('test123')
  cy.get('#formUsernameInput').type('test')
  cy.get('#formFirstNameInput').type('Test')
  cy.get('#formLastNameInput').type('User')
  cy.get('.form_postBtn').click();
  cy.get('@registerNewUserStub').should('have.been.calledWith', user);
  cy.get('@handleRedirectSpy').should('have.been.calledOnce');
})

it('updateUser is called when click Register', () => {
  const updateUserSpy = cy.spy().as('updateUserSpy');
  const user = {
    email: 'test@gmail.com',
    password: 'test123',
    display_name: 'test',
    first_name: 'Test',
    last_name: 'User',
  }

  cy.stub(Register, 'registerNewUser').as('registerNewUserStub').resolves({message: "Successfully created a new user"});

  cy.mount(<Register
    handleRedirect={() => {}}
    handleLogin={() => {}}
    updateUser={updateUserSpy}
    csrfToken="MockCSRFToken"
    setCsrfToken={() => {}}
  />)

  cy.get('#formEmailInput').type('test@gmail.com')
  cy.get('#formPasswordInput').type('test123')
  cy.get('#formUsernameInput').type('test')
  cy.get('#formFirstNameInput').type('Test')
  cy.get('#formLastNameInput').type('User')
  cy.get('.form_postBtn').click();
  cy.get('@registerNewUserStub').should('have.been.calledWith', user);
})

it('shows an error if the email already exists', () => {
  const updateUserSpy = cy.spy().as('updateUserSpy');
  const user = {
    email: 'test@gmail.com',
    password: 'test123',
    display_name: 'test',
    first_name: 'Test',
    last_name: 'User',
  }

  cy.stub(Register, 'registerNewUser').as('registerNewUserStub').resolves(
    {error: "Email already exists"}
  );

  cy.mount(<Register
    handleRedirect={() => {}}
    handleLogin={() => {}}
    updateUser={updateUserSpy}
    csrfToken="MockCSRFToken"
    setCsrfToken={() => {}}
  />)

  cy.get('#formEmailInput').type('test@gmail.com')
  cy.get('#formPasswordInput').type('test123')
  cy.get('#formUsernameInput').type('test')
  cy.get('#formFirstNameInput').type('Test')
  cy.get('#formLastNameInput').type('User')
  cy.get('.form_postBtn').click();
  cy.get('@registerNewUserStub').should('have.been.calledWith', user);
  cy.get('div .input_error').contains("Email already exists");
})

it('shows an error if the display name already exists', () => {
  const updateUserSpy = cy.spy().as('updateUserSpy');
  const user = {
    email: 'test@gmail.com',
    password: 'test123',
    display_name: 'test',
    first_name: 'Test',
    last_name: 'User',
  }

  cy.stub(Register, 'registerNewUser').as('registerNewUserStub').resolves(
    {error: "Display Name already exists"}
  );

  cy.mount(<Register
    handleRedirect={() => {}}
    handleLogin={() => {}}
    updateUser={updateUserSpy}
    csrfToken="MockCSRFToken"
    setCsrfToken={() => {}}
  />)

  cy.get('#formEmailInput').type('test@gmail.com')
  cy.get('#formPasswordInput').type('test123')
  cy.get('#formUsernameInput').type('test')
  cy.get('#formFirstNameInput').type('Test')
  cy.get('#formLastNameInput').type('User')
  cy.get('.form_postBtn').click();
  cy.get('@registerNewUserStub').should('have.been.calledWith', user);
  cy.get('div .input_error').contains("Display Name already exists");
})

it('handleLogin is called when click Have Account? Login.', () => {
  const handleLoginSpy = cy.spy().as('handleLoginSpy')

  cy.mount(<Register
    handleRedirect={() => {}}
    handleLogin={handleLoginSpy}
    updateUser={() => {}}
    csrfToken="MockCSRFToken"
    setCsrfToken={() => {}}
  />)

  cy.get('.bluebtn').click();
  cy.get('@handleLoginSpy').should('have.been.calledOnce');
})

