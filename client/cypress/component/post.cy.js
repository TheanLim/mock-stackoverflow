import VotingButtons from "../../src/components/main/baseComponents/votingbuttons";
import FlaggingButtons from "../../src/components/main/baseComponents/flaggingbuttons";
import SolutionButton from "../../src/components/main/baseComponents/solutionbutton";
import Post from "../../src/components/main/answerPage/post";

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

describe('Post', () => {
  let props;

  beforeEach(() => {
    props = {
      postType: 'question',
      pid: '1234',
      views: 100,
      text: 'This is a post',
      postBy: {
        _id: '5678',
        display_name: 'John Doe'
      },
      meta: 'asked 2 days ago',
      comments: [
        {
          _id: '9012',
          text: 'This is a comment',
          comment_by: {
            display_name: 'Jane Doe'
          },
          comment_date_time: new Date('2023-04-16T12:00:00Z'),
          votes: [],
          score: 0
        }
      ],
      score: 5,
      votes: [],
      status: 'open',
      user: {_id:'user1'},
      isSolution: false,
      parentPostBy: {
        _id: '5678'
      },
      handleVote: cy.stub().as('handleVoteStub'),
      handleLogin: cy.stub().as('handleLoginStub'),
      handleAddComment: cy.stub().as('handleAddCommentStub'),
      handleMarkSolution: cy.stub().as('handleMarkSolutionStub')
    };

    cy.stub(Post, 'isAuthorizedToVote').as('isAuthorizedToVoteStub').resolves(true);
  });

  afterEach(() => {
    props = {};
  });

  it('should render the views count', () => {
    cy.mount(<Post {...props} />);
    cy.get('.post_view').should('contain.text', props.views);
  });

  it('should render the post text', () => {
    cy.mount(<Post {...props} />);
    cy.get('#postText').should('contain.text', props.text);
  });

  it('should render the post author and meta', () => {
    cy.mount(<Post {...props} />);
    cy.get('.postAuthor').should('contain.text', props.postBy.display_name);
    cy.get('.postAuthor').should('contain.text', props.meta);
  });

  it('should render the comments', () => {
    cy.mount(<Post {...props} />);
    cy.get('.Comment').should('have.length', props.comments.length + 1);
  });
});
