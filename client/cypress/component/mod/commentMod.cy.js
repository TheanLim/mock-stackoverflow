import FlagCommentButton from '../../../src/components/main/answerPage/comment/flagcommentbutton'

describe('Flag Comment Buttons', () => {
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
      cy.mount(<FlagCommentButton {...props} />);
    
      cy.get('.flag').should('be.disabled');
      cy.get('.no-hover').should('exist');
    });

    it('should be black when isFlagged', () => {
        props.isFlagged = true
        cy.mount(<FlagCommentButton {...props} />);
      
        cy.get('.flag-black').should('exist');
    });

    it('should be transparent when not isFlagged', () => {
        props.isFlagged = false
        cy.mount(<FlagCommentButton {...props} />);
      
        cy.get('.flag-transparent').should('exist');
    });

    it('should invoke handleVote with correct arguments when the button is clicked', () => {
      props.isUserPostOwner = false;
      cy.mount(<FlagCommentButton {...props} />);
    
      cy.get('.flag').click();
      cy.get('@handleVoteStub').should('be.calledWith', 'comment', props.cid, 'flag');
    });
});