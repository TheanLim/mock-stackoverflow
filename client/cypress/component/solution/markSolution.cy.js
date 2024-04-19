import SolutionButton from "../../../src/components/main/baseComponents/solutionbutton";

describe('SolutionButton', () => {
  it('should disable button if isSolution and user is not the question owner', () => {
    cy.mount(<SolutionButton
      postType="answer"
      userId="user1"
      parentPostBy={{ _id: 'user2' }}
      isSolution={true} />);
    cy.get('button').should('be.disabled');
    cy.get('button .solution-btn-icon-green').should('exist');
  });

  it('should disable button if userId is not provided', () => {
    cy.mount(<SolutionButton
      postType="answer"
      isSolution={true} />);
    cy.get('button').should('be.disabled');
    cy.get('button .solution-btn-icon-green').should('exist');
  });

  it('should handleMarkSolution when click button if not isSolution (transparent) user is the question owner', () => {
    cy.mount(<SolutionButton
      postType="answer"
      userId="user1"
      parentPostBy={{ _id: 'user1' }}
      pid="1234"
      isSolution={false}
      handleMarkSolution={cy.stub().as('handleMarkSolutionStub')} />);
    cy.get('button').should('not.be.disabled');
    cy.get('button .solution-btn-icon-transparent').should('exist');
    cy.get('button').click();
    cy.get('@handleMarkSolutionStub').should('be.calledWith', '1234');
  });

  it('should handleMarkSolution when click button if isSolution (green) user is the question owner', () => {
    cy.mount(<SolutionButton
      postType="answer"
      userId="user1"
      parentPostBy={{ _id: 'user1' }}
      pid="1234"
      isSolution={true}
      handleMarkSolution={cy.stub().as('handleMarkSolutionStub')} />);
    cy.get('button').should('not.be.disabled');
    cy.get('button .solution-btn-icon-green').should('exist');
    cy.get('button').click();
    cy.get('@handleMarkSolutionStub').should('be.calledWith', '1234');
  });
});
