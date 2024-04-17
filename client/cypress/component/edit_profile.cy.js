import React from 'react'
import EditProfile from '../../src/components/main/editProfile'
import Profile from "../../src/components/main/profile";

it('mounts', () => {
  cy.mount(<EditProfile
    profileUser={""}
    handleProfile={() => {}}
  />)
  cy.get('#formDisplayNameInput')
  cy.get('#formEmailInput')
  cy.get('#formAboutText')
  cy.get('#formFNameInput')
  cy.get('#formLNameInput')
  cy.get('.form_postBtn')
})

it('shows display name inputted by user', () => {
  cy.mount(<EditProfile
    profileUser={""}
    handleProfile={() => {}}
  />)
  cy.get('#formDisplayNameInput').should('have.value', '')
  cy.get('#formDisplayNameInput').type('abc')
  cy.get('#formDisplayNameInput').should('have.value', 'abc')
})

it('shows email inputted by user', () => {
  cy.mount(<EditProfile
    profileUser={""}
    handleProfile={() => {}}
  />)
  cy.get('#formEmailInput').should('have.value', '')
  cy.get('#formEmailInput').type('abc')
  cy.get('#formEmailInput').should('have.value', 'abc')
})

it('shows about summary inputted by user', () => {
  cy.mount(<EditProfile
    profileUser={""}
    handleProfile={() => {}}
  />)
  cy.get('#formAboutText').should('have.value', '')
  cy.get('#formAboutText').type('abc')
  cy.get('#formAboutText').should('have.value', 'abc')
})

it('shows first name inputted by user', () => {
  cy.mount(<EditProfile
    profileUser={""}
    handleProfile={() => {}}
  />)
  cy.get('#formFNameInput').should('have.value', '')
  cy.get('#formFNameInput').type('abc')
  cy.get('#formFNameInput').should('have.value', 'abc')
})

it('shows last name inputted by user', () => {
  cy.mount(<EditProfile
    profileUser={""}
    handleProfile={() => {}}
  />)
  cy.get('#formLNameInput').should('have.value', '')
  cy.get('#formLNameInput').type('abc')
  cy.get('#formLNameInput').should('have.value', 'abc')
})

it('shows error message when required inputs are empty', () => {
  cy.mount(<EditProfile
    profileUser={""}
    handleProfile={() => {}}
  />)
  cy.get('.form_postBtn').click()
  cy.get('div .input_error').contains('Your display name is required.')
  cy.get('div .input_error').contains('Your email is required.')
  cy.get('div .input_error').contains('Your first name is required.')
  cy.get('div .input_error').contains('Your last name is required.')

})

it('shows error message when email is in invalid format', () => {
  cy.mount(<EditProfile
    profileUser={""}
    handleProfile={() => {}}
  />)
  cy.get('#formEmailInput').type('a')
  cy.get('.form_postBtn').click()
  cy.get('div .input_error').contains('Invalid Email Format.')
})

it('shows error message when about section is too long', () => {
  cy.mount(<EditProfile
    profileUser={""}
    handleProfile={() => {}}
  />)
  cy.get('#formAboutText').type('a'.repeat(231))
  cy.get('.form_postBtn').click()
  cy.get('div .input_error').contains('Limit about section to 230 words or less.')
})

it('calls viewUserProfile when loading the profile and loads existing info', () => {
  const mockUser = {
    _id: '0000ffff',
    reputation: 1,
    first_name: 'Test First Name',
    last_name: 'Test Last Name',
    about_summary: 'Test About',
    email: "test@example.com",
    display_name: 'Test Display Name',
    date_joined: (new Date('3/12/2024')).toISOString(),
    time_last_seen: (new Date('3/12/2024')).toISOString(),
  };
  const mockQList = [
    {
      title: "Test Title",
      asked_by: mockUser,
      ask_date_time: (new Date('3/12/2024')).toISOString(),
      answers: [
        {ans_date_time: (new Date('3/12/2024')).toISOString()}
      ]
    }
  ];

  const mockResponse = {
    profile: mockUser,
    profileOwner: true,
    questions: mockQList,
    answers: mockQList
  }
  cy.stub(EditProfile, 'viewUserProfile').as('viewUserProfileStub').resolves(mockResponse);

  cy.mount(<EditProfile
    profileUser={"0000ffff"}
    handleProfile={() => {}}
  />)
  cy.get('@viewUserProfileStub').should('have.been.calledWith', mockUser._id);
  cy.get('#formAboutText').contains(mockUser.about_summary);
  cy.get('#formDisplayNameInput').should('have.value', mockUser.display_name)
  cy.get('#formFNameInput').should('have.value', mockUser.first_name);
  cy.get('#formLNameInput').should('have.value', mockUser.last_name);
  cy.get('#formEmailInput').should('have.value', mockUser.email);
});

it('calls updateProfile when sending changes the profile', () => {
  const mockUser = {
    _id: '0000ffff',
    reputation: 1,
    first_name: 'Test First Name',
    last_name: 'Test Last Name',
    email: "test@example.com",
    about_summary: 'Test About',
    display_name: 'test display name',
    date_joined: (new Date('3/12/2024')).toISOString(),
    time_last_seen: (new Date('3/12/2024')).toISOString(),
  };
  const mockQList = [
    {
      title: "Test Title",
      asked_by: mockUser,
      ask_date_time: (new Date('3/12/2024')).toISOString(),
      answers: [
        {ans_date_time: (new Date('3/12/2024')).toISOString()}
      ]
    }
  ];

  const mockResponse = {
    profile: mockUser,
    profileOwner: true,
    questions: mockQList,
    answers: mockQList
  }

  const mockChanges = {
    email: "test@example.comm",
    display_name: "test display nameNew",
    about_summary: "Test AboutNew",
    first_name: "Test First NameNew",
    last_name: "Test Last NameNew"
  }
  cy.stub(EditProfile, 'viewUserProfile').as('viewUserProfileStub').resolves(mockResponse);
  cy.stub(EditProfile, 'updateProfile').as('updateProfileStub').resolves({user: mockUser._id});

  cy.mount(<EditProfile
    profileUser={"0000ffff"}
    handleProfile={() => {}}
  />)

  cy.get('#formAboutText').type("New");
  cy.get('#formDisplayNameInput').type("New");
  cy.get('#formFNameInput').type("New");
  cy.get('#formLNameInput').type("New");
  cy.get('#formEmailInput').type("m");
  cy.get('@viewUserProfileStub').should('have.been.calledWith', mockUser._id);
  cy.get('.form_postBtn').click();
  cy.get('@updateProfileStub').should('have.been.calledWith', mockChanges);
});

it('calls handleProfile after sending changes to the profile', () => {
  const mockUser = {
    _id: '0000ffff',
    reputation: 1,
    first_name: 'Test First Name',
    last_name: 'Test Last Name',
    email: "test@example.com",
    about_summary: 'Test About',
    display_name: 'test display name',
    date_joined: (new Date('3/12/2024')).toISOString(),
    time_last_seen: (new Date('3/12/2024')).toISOString(),
  };
  const mockQList = [
    {
      title: "Test Title",
      asked_by: mockUser,
      ask_date_time: (new Date('3/12/2024')).toISOString(),
      answers: [
        {ans_date_time: (new Date('3/12/2024')).toISOString()}
      ]
    }
  ];

  const mockResponse = {
    profile: mockUser,
    profileOwner: true,
    questions: mockQList,
    answers: mockQList
  }

  const mockChanges = {
    email: "test@example.comm",
    display_name: "test display nameNew",
    about_summary: "Test AboutNew",
    first_name: "Test First NameNew",
    last_name: "Test Last NameNew"
  }
  cy.stub(EditProfile, 'viewUserProfile').as('viewUserProfileStub').resolves(mockResponse);
  cy.stub(EditProfile, 'updateProfile').as('updateProfileStub').resolves({user: mockUser._id});
  const handleProfileSpy = cy.spy().as('handleProfileSpy');

  cy.mount(<EditProfile
    profileUser={"0000ffff"}
    handleProfile={handleProfileSpy}
  />)

  cy.get('#formAboutText').type("New");
  cy.get('#formDisplayNameInput').type("New");
  cy.get('#formFNameInput').type("New");
  cy.get('#formLNameInput').type("New");
  cy.get('#formEmailInput').type("m");
  cy.get('@viewUserProfileStub').should('have.been.calledWith', mockUser._id);
  cy.get('.form_postBtn').click();
  cy.get('@updateProfileStub').should('have.been.calledWith', mockChanges);
  cy.get('@handleProfileSpy').should('have.been.calledWith', mockUser._id);
});

it('shows an error if a new display name exists', () => {
  const mockUser = {
    _id: '0000ffff',
    reputation: 1,
    first_name: 'Test First Name',
    last_name: 'Test Last Name',
    email: "test@example.com",
    about_summary: 'Test About',
    display_name: 'test display name',
    date_joined: (new Date('3/12/2024')).toISOString(),
    time_last_seen: (new Date('3/12/2024')).toISOString(),
  };
  const mockQList = [
    {
      title: "Test Title",
      asked_by: mockUser,
      ask_date_time: (new Date('3/12/2024')).toISOString(),
      answers: [
        {ans_date_time: (new Date('3/12/2024')).toISOString()}
      ]
    }
  ];

  const mockResponse = {
    profile: mockUser,
    profileOwner: true,
    questions: mockQList,
    answers: mockQList
  }

  const mockChanges = {
    email: "test@example.comm",
    display_name: "test display nameNew",
    about_summary: "Test AboutNew",
    first_name: "Test First NameNew",
    last_name: "Test Last NameNew"
  }
  cy.stub(EditProfile, 'viewUserProfile').as('viewUserProfileStub').resolves(mockResponse);
  cy.stub(EditProfile, 'updateProfile').as('updateProfileStub').resolves(
    {error: "New Display Name already exists"}
  );

  cy.mount(<EditProfile
    profileUser={"0000ffff"}
    handleProfile={() => {}}
  />)

  cy.get('#formAboutText').type("New");
  cy.get('#formDisplayNameInput').type("New");
  cy.get('#formFNameInput').type("New");
  cy.get('#formLNameInput').type("New");
  cy.get('#formEmailInput').type("m");
  cy.get('@viewUserProfileStub').should('have.been.calledWith', mockUser._id);
  cy.get('.form_postBtn').click();
  cy.get('@updateProfileStub').should('have.been.calledWith', mockChanges);
  cy.get('div .input_error').contains('New Display Name already exists');
});

it('shows an error if a new display name exists', () => {
  const mockUser = {
    _id: '0000ffff',
    reputation: 1,
    first_name: 'Test First Name',
    last_name: 'Test Last Name',
    email: "test@example.com",
    about_summary: 'Test About',
    display_name: 'test display name',
    date_joined: (new Date('3/12/2024')).toISOString(),
    time_last_seen: (new Date('3/12/2024')).toISOString(),
  };
  const mockQList = [
    {
      title: "Test Title",
      asked_by: mockUser,
      ask_date_time: (new Date('3/12/2024')).toISOString(),
      answers: [
        {ans_date_time: (new Date('3/12/2024')).toISOString()}
      ]
    }
  ];

  const mockResponse = {
    profile: mockUser,
    profileOwner: true,
    questions: mockQList,
    answers: mockQList
  }

  const mockChanges = {
    email: "test@example.comm",
    display_name: "test display nameNew",
    about_summary: "Test AboutNew",
    first_name: "Test First NameNew",
    last_name: "Test Last NameNew"
  }
  cy.stub(EditProfile, 'viewUserProfile').as('viewUserProfileStub').resolves(mockResponse);
  cy.stub(EditProfile, 'updateProfile').as('updateProfileStub').resolves(
    {error: "New email already exists"}
  );

  cy.mount(<EditProfile
    profileUser={"0000ffff"}
    handleProfile={() => {}}
  />)

  cy.get('#formAboutText').type("New");
  cy.get('#formDisplayNameInput').type("New");
  cy.get('#formFNameInput').type("New");
  cy.get('#formLNameInput').type("New");
  cy.get('#formEmailInput').type("m");
  cy.get('@viewUserProfileStub').should('have.been.calledWith', mockUser._id);
  cy.get('.form_postBtn').click();
  cy.get('@updateProfileStub').should('have.been.calledWith', mockChanges);
  cy.get('div .input_error').contains('New email already exists');
});
