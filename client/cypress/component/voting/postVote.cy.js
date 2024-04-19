import VotingButtons from "../../../src/components/main/baseComponents/votingbuttons";

describe('VotingButtons', () => {
  it('should disable buttons if isUserPostOwner', () => {
    cy.mount(<VotingButtons isUserPostOwner={true} />);
    cy.get('button').should('be.disabled');
    cy.get('.upvote_button').should('have.class', 'white-bg').and('have.class', 'half-opaque');
    cy.get('.downvote_button').should('have.class', 'white-bg').and('have.class', 'half-opaque');
  });

  it('should enable buttons if not isUserPostOwner and handleVote', () => {
    cy.mount(<VotingButtons
      isUserPostOwner={false}
      handleVote={cy.stub().as('handleVoteStub')}  />);
    cy.get('button').should('not.be.disabled');
    cy.get('.upvote_button').click();
    cy.get('@handleVoteStub').should('be.calledWith', 'upvote');
    cy.get('.downvote_button').click();
    cy.get('@handleVoteStub').should('be.calledWith', 'downvote');
  });

  it('should render upvote button with green background if userVoteType is "upvote"', () => {
    cy.mount(<VotingButtons userVoteType="upvote" />);
    cy.get('.upvote_button').should('have.class', 'green-bg');
    cy.get('.downvote_button').should('have.class', 'white-bg');
  });

  it('should render downvote button with green background if userVoteType is "downvote"', () => {
    cy.mount(<VotingButtons userVoteType="downvote" />);
    cy.get('.upvote_button').should('have.class', 'white-bg');
    cy.get('.downvote_button').should('have.class', 'green-bg');
  });

  it('should render the correct score', () => {
    cy.mount(<VotingButtons score={10} />);
    cy.get('.post_score').should('contain.text', '10');
  });
});