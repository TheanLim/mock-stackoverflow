import Post from "../../../src/components/main/answerPage/post";

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
      handleMarkSolution: cy.stub().as('handleMarkSolutionStub'),
      handleProfile: cy.spy().as('handleProfileSpy')
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

  it('should call handle profile when clicking on question owner', () => {
    cy.mount(<Post {...props} />);
    cy.get('.postAuthor').click();
    cy.get('@handleProfileSpy').should('have.been.calledWith', '5678');
  });
});
