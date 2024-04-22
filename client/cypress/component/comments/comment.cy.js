import Comment from "../../../src/components/main/answerPage/comment"

describe('Comment - if text is NOT provided -> test button click, text area and handleComment submission', () => {
  let props;

  beforeEach(() => {
    // Set up the default props
    props = {
      parentPostType: 'post',
      parentId: '1234',
      cid: '5678',
      text: null,
      commentBy: {
        _id: '9876',
        display_name: 'John Doe'
      },
      meta: 'posted 2 days ago',
      votes: [],
      score: 0,
      handleAddComment: cy.stub().as('handleAddCommentStub'),
      handleVote: cy.stub(),
      user: null,
      handleLogin: cy.stub().as('handleLoginStub'),
      handleProfile: cy.spy().as('handleProfileSpy')
    };

    // Mock isAuthorizedToVote function; default to true authorized
    cy.stub(Comment, 'isAuthorizedToVote').as('isAuthorizedToVoteStub').resolves(true);
  });

  // Clean up after each test
  afterEach(() => {
    props = {};
  });

  it('should show the "Add a comment" button when text is not provided', () => {
    cy.mount(<Comment {...props} />);
  
    cy.get('.comment_button').should('exist').and('contain.text', 'Add a comment');
  });

  it('should show the textarea when the "Add a comment" button is clicked', () => {
    props.user = { _id: 'user3' }; // Set a user to simulate being logged in
    cy.stub(Comment, 'isAuthorizedToComment').as('isAuthorizedToCommentStub').resolves(true);
  
    cy.mount(<Comment {...props} />);
  
    cy.get('.comment_button').click();
    cy.get('textarea').should('exist');
  });

  it('should call handleLogin when the "Add a comment" button is clicked and the user is not logged in', () => {
    props.user = null;
  
    cy.mount(<Comment {...props} />);
  
    cy.get('.comment_button').click();
    cy.get('@handleLoginStub').should('be.called');
  });

  it('should NOT show the textarea when the "Add a comment" button is clicked if the user is unauthorized', () => {
    props.user = { _id: 'user3' }; // Set a user to simulate being logged in
    cy.stub(Comment, 'isAuthorizedToComment').as('isAuthorizedToCommentStub').resolves({error: 'Unauthorized'});
  
    cy.mount(<Comment {...props} />);
  
    cy.get('.comment_button').click();
    cy.get('textarea').should('not.exist');
  });

  it('should trigger handleAddComment with correct arguments when Enter is pressed in the textarea', () => {
    // Only renders when the user is authorized
    props.user = { _id: 'user3' };
    const commentText = 'This is a new comment';
    cy.stub(Comment, 'isAuthorizedToComment').as('isAuthorizedToCommentStub').resolves(true);
  
    cy.mount(<Comment {...props} />);
  
    cy.get('.comment_button').click();
    cy.get('textarea').type(`${commentText}{enter}`);
  
    cy.get('@handleAddCommentStub').should('be.calledWith', props.parentPostType, props.parentId, commentText);
  });

  it('should trigger validateHyperlink with correct arguments when Enter is pressed in the textarea', () => {
    // Only renders when the user is authorized
    props.user = { _id: 'user3' };
    const commentText = 'This is a new comment';
    cy.stub(Comment, 'isAuthorizedToComment').as('isAuthorizedToCommentStub').resolves(true);
    cy.stub(Comment, 'validateHyperlink').as('validateHyperlinkStub').returns(true);

    cy.mount(<Comment {...props} />);

    cy.get('.comment_button').click();
    cy.get('textarea').type(`${commentText}{enter}`);

    cy.get('@validateHyperlinkStub').should('have.been.calledWith', commentText);
    cy.get('@handleAddCommentStub').should('be.calledWith', props.parentPostType, props.parentId, commentText);
  });

  it('should hide the textarea when Escape is pressed', () => {
    // Only renders when the user is authorized
    props.user = { _id: 'user3' };
    cy.stub(Comment, 'isAuthorizedToComment').as('isAuthorizedToCommentStub').resolves(true);

    cy.mount(<Comment {...props} />);
  
    cy.get('.comment_button').click();
    cy.get('textarea').should('exist');
    cy.get('textarea').type('{esc}');
    cy.get('textarea').should('not.exist');
  });
});

describe('Comment - if text is provided, check score, upvote and flag buttons. ', () => {
  let props;

  beforeEach(() => {
    // Set up the default props
    props = {
      parentPostType: 'post',
      parentId: '1234',
      cid: '5678',
      text: 'This is a comment',
      commentBy: {
        _id: '9876',
        display_name: 'John Doe'
      },
      meta: 'posted 2 days ago',
      votes: [],
      score: 0,
      handleAddComment: cy.stub().as('handleAddCommentStub'),
      handleVote: cy.stub().as('handleVoteStub'),
      user: null,
      handleLogin: cy.stub(),
      handleProfile: cy.spy().as('handleProfileSpy')
    };
  });

  // Clean up after each test
  afterEach(() => {
    props = {};
  });

  it('should show the score at the correct place when votes are provided', () => {
    props.votes = [
      { vote_type: 'upvote', voter: 'user1' },
      { vote_type: 'upvote', voter: 'user2' },
      { vote_type: 'downvote', voter: 'user3' }
    ];
    props.score = 1; // upvotes count as +1 and downvotes count as -1
  
    cy.mount(<Comment {...props} />);
  
    cy.get('.comment_score').should('contain.text', props.score);
  });

  it('should call handleHyperlink when displaying text', () => {
    cy.stub(Comment, 'handleHyperlink').as('handleHyperlinkStub').returns(props.text + " Checked!");
    cy.mount(<Comment {...props} />);

    cy.get('@handleHyperlinkStub').should('have.been.calledWith', props.text);
    cy.get('.comment_text').should('contain.text', props.text + " Checked!");
  });

  // Start testing Upvote/Flag button
  it('should show the upvote/flag button if isAuthorizedToUpvote is true', () => {
    props.user = 'user1' // need to define user since its the useEffect dependency
    cy.stub(Comment, 'isAuthorizedToVote').as('isAuthorizedToVoteStub').resolves(true);
  
    cy.mount(<Comment {...props} />);
  
    cy.get('.upvote').should('exist');
    cy.get('.flag').should('exist');
  });

  it('should NOT show the upvote/flag button if user is undefined', () => {
    cy.stub(Comment, 'isAuthorizedToVote').as('isAuthorizedToVoteStub').resolves(true);
  
    cy.mount(<Comment {...props} />);
  
    cy.get('.upvote').should('not.exist');
    cy.get('.flag').should('not.exist');
  });

  it('should NOT show the upvote/flag button if not authorized', () => {
    props.user = 'user1' // need to define user since its the useEffect dependency
    cy.stub(Comment, 'isAuthorizedToVote').as('isAuthorizedToVoteStub').resolves({error: 'Unauthorized'});
  
    cy.mount(<Comment {...props} />);
  
    cy.get('.upvote').should('not.exist');
    cy.get('.flag').should('not.exist');
  });

  it('should disable the upvote/flag button if isUserPostOwner is true', () => {
    props.commentBy = {_id:'user1'};
    props.user = 'user1' // need to define user since its the useEffect dependency
    cy.stub(Comment, 'isAuthorizedToVote').as('isAuthorizedToVoteStub').resolves(true);
    
    cy.mount(<Comment {...props} />);
  
    cy.get('.upvote').should('be.disabled');
    cy.get('.flag').should('be.disabled');
  });

  it('should invoke handleVote with correct arguments when upvote/flag button is clicked', () => {
    props.user = 'user1' // need to define user since its the useEffect dependency
    cy.stub(Comment, 'isAuthorizedToVote').as('isAuthorizedToVoteStub').resolves(true);

    cy.mount(<Comment {...props} />);
  
    cy.get('.upvote').click();
    cy.get('@handleVoteStub').should('be.calledWith', 'comment', props.cid, 'upvote');

    cy.get('.flag').click();
    cy.get('@handleVoteStub').should('be.calledWith', 'comment', props.cid, 'flag');
  });

  it('should show that upvote and flag are separated/decoupled - upvote should exists but not flag', () => {
    props.user = 'user1' // need to define user since its the useEffect dependency
    cy.stub(Comment, 'isAuthorizedToVote').withArgs("upvote").resolves(true)

    cy.mount(<Comment {...props} />);
  
    cy.get('.upvote').should('exist');
    cy.get('.flag').should('not.exist');
  });
  // End of testing Upvote/Flag button

  it('should render the comment_text section correctly', () => {
    props.text = 'This is a comment';
  
    cy.mount(<Comment {...props} />);
  
    cy.get('#comment_text').should('contain.text', props.text);
    cy.get('.comment_details').should('contain.text', props.commentBy.display_name);
    cy.get('.comment_details').should('contain.text', props.meta);
  });

  it('should call handleProfile when clicking on comment details', () => {
    props.text = 'This is a comment';

    cy.mount(<Comment {...props} />);

    cy.get('#comment_text').should('contain.text', props.text);
    cy.get('.comment_details').should('contain.text', props.commentBy.display_name);
    cy.get('.comment_details').should('contain.text', props.meta);
    cy.get('.comment_details').click();
    cy.get('@handleProfileSpy').should('have.been.calledWith', '9876');
  });
  
});