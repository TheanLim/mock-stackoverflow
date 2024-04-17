const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const randomstring = require("randomstring");
const Vote = require("../models/votes");
const User = require("../models/users");
const Comment = require("../models/comments");
const Answer = require("../models/answers");
const Question = require("../models/questions");

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

const createUsers = async (numberOfUsers) => {
    let users = []
    for (let i = 0; i < numberOfUsers; i++) {
        let user = await User.create({
            reputation:1,
            first_name: 'John',
            last_name: 'Doe',
            email: randomstring.generate(),
            password: 'password',
            display_name: randomstring.generate(),
            date_joined: new Date(),
            time_last_seen: new Date(),
        });
        users.push(user);
    }
    return users;
}

const createVotes = async (voteTypeList) => {
    const users = await createUsers(voteTypeList.length);

    let allVotes = [];
    for (let i = 0; i < voteTypeList.length; i++) {
        let vote = await Vote.create({
            voter: users[i],
            vote_type: voteTypeList[i],
        });
        allVotes.push(vote);
    }
    return allVotes;
}

const createComments = async (numberOfComments) => {
    const votes = await createVotes(Array(numberOfComments).fill('upvote'));
    const commentOwner = await createUsers(numberOfComments)

    let comments = [];
    for (let i = 0; i < numberOfComments; i++) {
        const comment = await Comment.create({
            text: 'Hello',
            comment_by: commentOwner[i],
            comment_date_time: new Date(),
            votes: [votes[i]]
        });
        comments.push(comment);
    }
    return comments;
}

const createAnswers = async (numberOfAnswers) =>{
    const votes = await createVotes(Array(numberOfAnswers).fill('upvote'));
    const comments = await createComments(numberOfAnswers); 
    const answerOwner = await createUsers(1); 
    let answers = [];
    for (let i = 0; i < numberOfAnswers; i++) {
        const answer = await Answer.create({
            text:'hello',
            comments:[comments[i]],
            votes:[votes[i]],
            ans_by: answerOwner[i],
            ans_date_time: new Date(),
        });
        answers.push(answer);
    }
    return answers;
}

const createQuestions = async (numberOfQuestions) =>{
    const votes = await createVotes(Array(numberOfQuestions).fill('upvote'));
    const comments = await createComments(numberOfQuestions); 
    const answers = await createAnswers(numberOfQuestions);
    let questions = [];
    for (let i = 0; i < numberOfQuestions; i++) {
        const question = await Question.create({
            title: 'Title',
            text:'text',
            ask_date_time: new Date(),
            answers:[answers[i]],
            comments:[comments[i]],
            votes:[votes[i]],
            status: 'open'
        });
        questions.push(question);
    }
    return questions;
}

describe('commentSchema', () => {
    beforeEach(async () => {
        // Clear the database before each test
        await Comment.deleteMany({});
        await User.deleteMany({});
        await Vote.deleteMany({});
    });

    test('Virtual property postOwner should reference the correct user', async () => {
        let user = await createUsers(1);
        user = user[0]
        let comment = await Comment.create({
            text: 'Hello',
            comment_by: user,
            comment_date_time: new Date(),
            votes:[]
        });

        // Need to populate because User is a foreign field
        comment = await comment.populate('postOwner');
        expect(comment.postOwner.equals(user));
    });

    test('Virtual property score should calculate correctly based on votes', async () => {
        // Create a comment with associated votes
        const votes = await createVotes(['upvote','upvote', 'downvote']);
        let commentOwner = await createUsers(1);
        commentOwner = commentOwner[0]

        const comment = await Comment.create({
            text: 'Hello',
            comment_by: commentOwner,
            comment_date_time: new Date(),
            votes: votes
        });

        expect(comment.score).toBe(1); // Upvotes (2) - Downvotes (1) = 1
    });

    test('Deleting a comment should delete associated votes', async () => {
        let comment = await createComments(2);
        comment = comment[0]

        // Trigger deletion of the answer
        await comment.deleteOne();

        // Check if comments and votes are deleted
        const deletedComment = await Comment.findById(comment._id);
        expect(deletedComment).toBeNull();
        // Assert that associated votes are also deleted
        for (let i = 0; i < comment.votes.length; i++) {
            let deletedVote = await Vote.findById(comment.votes[i]._id);
            expect(deletedVote).toBeNull();
        }
    });
});  

describe('answerSchema', () => {
    beforeEach(async () => {
        // Clear the database before each test
        await Answer.deleteMany({});
        await Comment.deleteMany({});
        await User.deleteMany({});
        await Vote.deleteMany({});
    });

    test('Virtual property postOwner should reference the correct user', async () => {
        let user = await createUsers(1);
        user = user[0]
        let answer = await Answer.create({
            text: 'Hello',
            comments:[],
            votes:[],
            ans_by: user,
            ans_date_time: new Date(),
        });

        // Need to populate because User is a foreign field
        answer = await answer.populate('postOwner');
        expect(answer.postOwner.equals(user));
    });

    test('Virtual property score should calculate correctly based on votes', async () => {
        // Create a comment with associated votes
        const votes = await createVotes(['upvote','upvote', 'downvote']);
        let answerOwner = await createUsers(1);
        answerOwner = answerOwner[0]

        let answer = await Answer.create({
            text: 'Hello',
            comments:[],
            votes: votes,
            ans_by: answerOwner,
            ans_date_time: new Date(),
        });

        expect(answer.score).toBe(1); // Upvotes (2) - Downvotes (1) = 1
    });

    test('Deleting an answer should delete associated votes and comments', async () => {
        let answer = await createAnswers(1);
        answer = answer[0]
    
        // Trigger deletion of the answer
        await answer.deleteOne();

        const answerVotes = answer.votes
        const answerComments = answer.comments

        // Check if comments and votes are deleted
        const deletedAnswer = await Answer.findById(answer._id);
        expect(deletedAnswer).toBeNull();
        // Assert that associated votes are also deleted
        for (let i = 0; i < answerVotes; i++) {
            let deletedVote = await Vote.findById(answerVotes[i]._id);
            expect(deletedVote).toBeNull();
        }
        // Comments are deleted
        for (let i = 0; i < answerComments.length; i++) {
            let deletedComment = await Comment.findById(answerComments[i]._id);
            expect(deletedComment).toBeNull();
            // Comment's votes are deleted
            for (let j = 0; j < answerComments[i].votes.length; j++) {
                let deletedVote = await Vote.findById(answerComments[i].votes[j]._id);
                expect(deletedVote).toBeNull();
            }
        }
    });
});  

describe('questionSchema', () => {
    beforeEach(async () => {
        // Clear the database before each test
        await Question.deleteMany({});
        await Answer.deleteMany({});
        await Comment.deleteMany({});
        await User.deleteMany({});
        await Vote.deleteMany({});
    });

    test('Virtual property postOwner should reference the correct user', async () => {
        let user = await createUsers(1);
        user = user[0]
        let question = await Question.create({
            title:'title',
            text: 'text',
            asked_by: user,
            ask_date_time: new Date(),
            status: 'open'
        });

        // Need to populate because User is a foreign field
        question = await question.populate('postOwner');
        expect(question.postOwner.equals(user));
    });

    test('Virtual property score should calculate correctly based on votes', async () => {
        // Create a comment with associated votes
        const votes = await createVotes(['upvote','upvote', 'downvote']);
        let user = await createUsers(1);
        user = user[0]

        let question = await Question.create({
            title:'title',
            text: 'text',
            asked_by: user,
            ask_date_time: new Date(),
            status: 'open',
            votes: votes
        });

        expect(question.score).toBe(1); // Upvotes (2) - Downvotes (1) = 1
    });

    test('Deleting a quesiton should delete associated answers, votes and comments', async () => {
        let question = await createQuestions(1);
        question = question[0]
    
        // Trigger deletion of the answer
        await question.deleteOne();

        const questionVotes = question.votes
        const questionComments = question.comments
        const questionAnswers = question.answers

        // Question itself should be deleted
        const deletedQuestion = await Question.findById(question._id);
        expect(deletedQuestion).toBeNull();

        // Assert that associated votes are also deleted
        for (let i = 0; i < questionVotes; i++) {
            let deletedVote = await Vote.findById(questionVotes[i]._id);
            expect(deletedVote).toBeNull();
        }

        // Comments are deleted
        for (let i = 0; i < questionComments.length; i++) {
            let deletedComment = await Comment.findById(questionComments[i]._id);
            expect(deletedComment).toBeNull();
            // Comment's votes are deleted
            for (let j = 0; j < questionComments[i].votes.length; j++) {
                let deletedVote = await Vote.findById(questionComments[i].votes[j]._id);
                expect(deletedVote).toBeNull();
            }
        }

        // Answers are deleted
        for (let k= 0; k < questionAnswers.length; k++) {
            let answer = questionAnswers[k];
            let deletedAnswer = await Answer.findById(answer._id);
            expect(deletedAnswer).toBeNull();
            // Answer's Comments are deleted
            for (let i = 0; i < answer.comments.length; i++) {
                let answerComment = answer.comments[i];
                let deletedComment = await Comment.findById(answerComment._id);
                expect(deletedComment).toBeNull();
                // Answer's Comment's votes are deleted
                for (let j = 0; j < answerComment.votes.length; j++) {
                    let answerCommentVote = answerComment.votes[j];
                    let deletedVote = await Vote.findById(answerCommentVote._id);
                    expect(deletedVote).toBeNull();
                }
            }
        }
    });
});  