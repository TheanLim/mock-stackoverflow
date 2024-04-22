import React from 'react'
import Profile from '../../../src/components/main/profile'
import Login from "../../../src/components/main/login";

it('mounts', () => {
  cy.stub(Login, 'fetchCSRF').as('fetchCSRFStub').resolves("MockCSRFToken");
  cy.stub(Login, 'checkLoginStatus').as('checkLoginStatusStub').resolves("MockUser");
  cy.mount(<Profile
    profileUser={""}
    handleAnswer={() => {}}
    handleEditProfile={() => {}}
  />)

  cy.get('.info-line').contains("Display Name:")
  cy.get('.info-line').contains("Joined:")
  cy.get('.info-line').contains("Last seen:")
})

it('calls viewUserProfile when loading the profile', () => {
  const mockUser = {
    _id: '0000ffff',
    reputation: 1,
    first_name: 'Test First Name',
    last_name: 'Test Last Name',
    email: "test@example.com",
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
  cy.stub(Profile, 'viewUserProfile').as('viewUserProfileStub').resolves(mockResponse);

  cy.mount(<Profile
    profileUser={"0000ffff"}
    handleAnswer={() => {}}
    handleEditProfile={() => {}}
  />)

  cy.get('@viewUserProfileStub').should('have.been.calledWith', mockUser._id);
});

it('calls getMetaData when loading the profile', () => {
  const mockUser = {
    _id: '0000ffff',
    reputation: 1,
    first_name: 'Test First Name',
    last_name: 'Test Last Name',
    email: "test@example.com",
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
  cy.stub(Profile, 'viewUserProfile').as('viewUserProfileStub').resolves(mockResponse);
  cy.stub(Profile, 'getMetaData').as('getMetaDataStub').returns("DateRes");

  cy.mount(<Profile
    profileUser={"0000ffff"}
    handleAnswer={() => {}}
    handleEditProfile={() => {}}
  />)

  cy.get('@viewUserProfileStub').should('have.been.calledWith', mockUser._id);
  cy.get('@getMetaDataStub').should('have.been.calledWith', new Date(mockUser.date_joined));
  cy.get('@getMetaDataStub').should('have.been.calledWith', new Date(mockUser.time_last_seen));
  cy.get('@getMetaDataStub').should('have.been.calledWith', new Date(mockQList[0].ask_date_time));
  cy.get('@getMetaDataStub').should('have.been.calledWith', new Date(mockQList[0].answers[0].ans_date_time));
});

it('calls handleHyperlink when loading the about section of profile', () => {
  const mockUser = {
    _id: '0000ffff',
    reputation: 1,
    first_name: 'Test First Name',
    last_name: 'Test Last Name',
    email: "test@example.com",
    about_summary: "About Me",
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
  cy.stub(Profile, 'viewUserProfile').as('viewUserProfileStub').resolves(mockResponse);
  cy.stub(Profile, 'getMetaData').as('getMetaDataStub').returns("DateRes");
  cy.stub(Profile, 'handleHyperlink').as('handleHyperlinkStub')
    .returns(mockUser.about_summary + " Checked!");

  cy.mount(<Profile
    profileUser={"0000ffff"}
    handleAnswer={() => {}}
    handleEditProfile={() => {}}
  />)

  cy.get('@viewUserProfileStub').should('have.been.calledWith', mockUser._id);
  cy.get('@getMetaDataStub').should('have.been.calledWith', new Date(mockUser.date_joined));
  cy.get('@getMetaDataStub').should('have.been.calledWith', new Date(mockUser.time_last_seen));
  cy.get('@getMetaDataStub').should('have.been.calledWith', new Date(mockQList[0].ask_date_time));
  cy.get('@getMetaDataStub').should('have.been.calledWith', new Date(mockQList[0].answers[0].ans_date_time));
  cy.get('@handleHyperlinkStub').should('have.been.calledWith', mockUser.about_summary);
});

it('calls handleAnswer when clicking on a Asked Question', () => {
  const mockUser = {
    _id: '0000ffff',
    reputation: 1,
    first_name: 'Test First Name',
    last_name: 'Test Last Name',
    email: "test@example.com",
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
  cy.stub(Profile, 'viewUserProfile').as('viewUserProfileStub').resolves(mockResponse);
  const handleAnswerSpy = cy.spy().as('handleAnswerSpy');

  cy.mount(<Profile
    profileUser={"0000ffff"}
    handleAnswer={handleAnswerSpy}
    handleEditProfile={() => {}}
  />)

  cy.get('@viewUserProfileStub').should('have.been.calledWith', mockUser._id);
  cy.get('.postTitle').contains("Test Title").click();
  cy.get('@handleAnswerSpy').should('have.been.calledOnce');
});

it('calls handleAnswer when clicking on a Answered Question', () => {
  const mockUser = {
    _id: '0000ffff',
    reputation: 1,
    first_name: 'Test First Name',
    last_name: 'Test Last Name',
    email: "test@example.com",
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
  const mockAList = [
    {
      title: "Test Title 2",
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
    answers: mockAList
  }
  cy.stub(Profile, 'viewUserProfile').as('viewUserProfileStub').resolves(mockResponse);
  const handleAnswerSpy = cy.spy().as('handleAnswerSpy');

  cy.mount(<Profile
    profileUser={"0000ffff"}
    handleAnswer={handleAnswerSpy}
    handleEditProfile={() => {}}
  />)

  cy.get('@viewUserProfileStub').should('have.been.calledWith', mockUser._id);
  cy.get('.postTitle').contains("Test Title 2").click();
  cy.get('@handleAnswerSpy').should('have.been.calledOnce');
});

it('renders all personal information if profile owner is viewing', () => {
  const mockUser = {
    _id: '0000ffff',
    reputation: 1,
    first_name: 'Test First Name',
    last_name: 'Test Last Name',
    email: "test@example.com",
    about_summary: "Test Summary",
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
  const mockAList = [
    {
      title: "Test Title 2",
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
    answers: mockAList
  }
  cy.stub(Profile, 'viewUserProfile').as('viewUserProfileStub').resolves(mockResponse);
  cy.stub(Profile, 'getMetaData').as('getMetaDataStub').returns("TestDate");
  const handleAnswerSpy = cy.spy().as('handleAnswerSpy');

  cy.mount(<Profile
    profileUser={"0000ffff"}
    handleAnswer={handleAnswerSpy}
    handleEditProfile={() => {}}
  />)

  cy.get('@viewUserProfileStub').should('have.been.calledWith', mockUser._id);
  cy.get('.info-line').contains(`Display Name: ${mockUser.display_name}`)
  cy.get('.info-line').contains(`Joined: TestDate`)
  cy.get('.info-line').contains(`Last seen: TestDate`)
  cy.get('.info-line').contains(`Email: ${mockUser.email}`)
  cy.get('.about-summary').contains(`Test Summary`)
  cy.get('.info-line').contains(`${mockUser.reputation} reputation earned`)
  cy.get('.info-line').contains(`${mockQList.length} questions asked`)
  cy.get('.info-line').contains(`${mockAList.length} questions answered`)
  cy.get('.bluebtn').contains('Edit Profile')
});

it('calls edit profile when button clicked when viewing own profile', () => {
  const mockUser = {
    _id: '0000ffff',
    reputation: 1,
    first_name: 'Test First Name',
    last_name: 'Test Last Name',
    email: "test@example.com",
    about_summary: "Test Summary",
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
  const mockAList = [
    {
      title: "Test Title 2",
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
    answers: mockAList
  }
  cy.stub(Profile, 'viewUserProfile').as('viewUserProfileStub').resolves(mockResponse);
  cy.stub(Profile, 'getMetaData').as('getMetaDataStub').returns("TestDate");
  const handleEditProfileSpy = cy.spy().as('handleEditProfileSpy');

  cy.mount(<Profile
    profileUser={"0000ffff"}
    handleAnswer={() => {}}
    handleEditProfile={handleEditProfileSpy}
  />)

  cy.get('.bluebtn').contains('Edit Profile').click()
  cy.get('@handleEditProfileSpy').should('have.been.calledOnce');

});
