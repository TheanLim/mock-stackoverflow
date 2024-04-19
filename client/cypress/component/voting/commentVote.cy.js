import UpvoteCommentButton from "../../../src/components/main/answerPage/comment/upvotecommentbutton";

describe('Upvote Comment Button', () => {
    let props;
  
    beforeEach(() => {
      // Set up the default props
      props = {
        cid: "0000ffff",
        handleVote: cy.stub().as('handleVoteStub'),
      }
    })
  
    // Clean up after each test
    afterEach(() => {
      props = {};
    });
  
    it('should disable the button and no-hover if isUserPostOwner', () => {
      props.isUserPostOwner = true;
      cy.mount(<UpvoteCommentButton {...props} />);
    
      cy.get('.upvote').should('be.disabled');
      cy.get('.no-hover').should('exist');
    });

    it('should be black when isUpvoted', () => {
        props.isUpvoted = true
        cy.mount(<UpvoteCommentButton {...props} />);
      
        cy.get('.upvote-black').should('exist');
    });

    it('should be transparent when not isFlagged', () => {
        props.isUpvoted = false
        cy.mount(<UpvoteCommentButton {...props} />);
      
        cy.get('.upvote-transparent').should('exist');
    });

    it('should invoke handleVote with correct arguments when the button is clicked', () => {
      props.isUserPostOwner = false;
      cy.mount(<UpvoteCommentButton {...props} />);
    
      cy.get('.upvote').click();
      cy.get('@handleVoteStub').should('be.calledWith', 'comment', props.cid, 'upvote');
    });
});