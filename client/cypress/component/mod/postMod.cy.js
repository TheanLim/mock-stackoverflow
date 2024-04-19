import FlaggingButtons from "../../../src/components/main/baseComponents/flaggingbuttons";

describe('FlaggingButtons', () => {
  it('should not render any buttons if not isAuthorizedToFlag and not isAuthorizedToCloseReopen', () => {
    cy.mount(<FlaggingButtons
      postType="question"
      isAuthorizedToFlag={false}
      isAuthorizedToCloseReopen={false} />);
    cy.get('button').should('not.exist');
  });

  it('should disable flags if isUserPostOwner and isAuthorizedToFlag', () => {
    cy.mount(<FlaggingButtons
      postType="question"
      isUserPostOwner={true}
      isAuthorizedToFlag={true} />);
    cy.get('button').should('be.disabled');
    cy.get('button').should('contain.text', 'flag');
  });

  it('should enable and handle flag button if NOT isUserPostOwner but isAuthorizedToFlag', () => {
    cy.mount(<FlaggingButtons
      handleVote={cy.stub().as('handleVoteStub')}
      postType="question"
      pid="1234"
      isUserPostOwner={false}
      isAuthorizedToFlag={true} />);
    cy.get('button').should('not.be.disabled');
    cy.get('button').should('contain.text', 'flag');
    cy.get('button').click();
    cy.get('@handleVoteStub').should('be.calledWith', 'question', '1234', 'flag');
  });

  it('should have the correct flaggedCnt if isAuthorizedToFlag', () => {
    cy.mount(<FlaggingButtons
      handleVote={cy.stub().as('handleVoteStub')}
      postType="question"
      pid="1234"
      flaggedCnt={3}
      isAuthorizedToFlag={true} />);
    cy.get('button').should('not.be.disabled');
    cy.get('button').should('contain.text', 'flag (3)');
  });

  it('should not render the Close/Reopen if postType is not "question"', () => {
    cy.mount(<FlaggingButtons
      postType="answer"
      isAuthorizedToFlag={true}
      isAuthorizedToCloseReopen={true} />);
    cy.get('button').should('have.length', 1); // coming from Flag but not Close/Reopen
  });

  it('should enable and handle a Close button if the question post is open, and isAuthorizedToCloseReopen', () => {
    cy.mount(<FlaggingButtons
      handleVote={cy.stub().as('handleVoteStub')}
      postType="question"
      pid="1234"
      status="open"
      closeReopenCnt={2}
      isAuthorizedToCloseReopen={true} />);
    cy.get('button').should('have.length', 1);
    cy.get('button').last().should('contain.text', 'Close (2)');
    cy.get('button').last().click();
    cy.get('@handleVoteStub').should('be.calledWith', 'question', '1234', 'close');
  });

  it('should enable and handle a Reopen button if the question post is closed, and isAuthorizedToCloseReopen', () => {
    cy.mount(<FlaggingButtons
      handleVote={cy.stub().as('handleVoteStub')}
      postType="question"
      pid="1234"
      status="closed"
      closeReopenCnt={2}
      isAuthorizedToCloseReopen={true} />);
    cy.get('button').should('have.length', 1);
    cy.get('button').last().should('contain.text', 'Reopen (2)');
    cy.get('button').last().click();
    cy.get('@handleVoteStub').should('be.calledWith', 'question', '1234', 'reopen');
  });
});