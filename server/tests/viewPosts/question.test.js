// Unit tests for utils/question.js
const mockingoose = require('mockingoose');
const supertest = require("supertest")
const Question = require("../../models/questions");
const { getQuestionsByOrder, filterQuestionsBySearch } = require('../../utils/question')
const {default: mongoose} = require("mongoose");
Question.schema.path('answers', Array);

const _tag1 = {
    _id: '507f191e810c19729de860ea',
    name: 'react'
};
const _tag2 = {
    _id: '65e9a5c2b26199dbcc3e6dc8',
    name: 'javascript'
};
const _tag3 = {
    _id: '65e9b4b1766fca9451cba653',
    name: 'android'
};
const _ans1 = {
    _id: '65e9b58910afe6e94fc6e6dc',
    text: 'ans1',
    ans_by: 'ans_by1',
    ans_date_time: new Date('2023-11-18T09:24:00')
}

const _ans2 = {
    _id: '65e9b58910afe6e94fc6e6dd',
    text: 'ans2',
    ans_by: 'ans_by2',
    ans_date_time: new Date('2023-11-20T09:24:00')
}

const _ans3 = {
    _id: '65e9b58910afe6e94fc6e6de',
    text: 'ans3',
    ans_by: 'ans_by3',
    ans_date_time: new Date('2023-11-19T09:24:00')
}

const _ans4 = {
    _id: '65e9b58910afe6e94fc6e6df',
    text: 'ans4',
    ans_by: 'ans_by4',
    ans_date_time: new Date('2023-11-19T09:24:00')
}

const _questions = [
    {
        _id: '65e9b58910afe6e94fc6e6dc',
        title: 'Quick question about storage on android',
        text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
        tags: [_tag3, _tag2],
        answers: [_ans1, _ans2],
        ask_date_time: new Date('2023-11-16T09:24:00')
    },
    {
        _id: '65e9b5a995b6c7045a30d823',
        title: 'Object storage for a web application',
        text: 'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.',
        tags: [_tag1, _tag2],
        answers: [_ans1, _ans2, _ans3],
        ask_date_time: new Date('2023-11-17T09:24:00')
    },
    {
        _id: '65e9b9b44c052f0a08ecade0',
        title: 'Is there a language to write programmes by pictures?',
        text: 'Does something like that exist?',
        tags: [],
        answers: [],
        ask_date_time: new Date('2023-11-19T09:24:00')
    },
    {
        _id: '65e9b716ff0e892116b2de09',
        title: 'Unanswered Question #2',
        text: 'Does something like that exist?',
        tags: [],
        answers: [],
        ask_date_time: new Date('2023-11-20T09:24:00')
    },
]
let server;
describe('question util module', () => {
    beforeEach(() => {
        server = require("../../server");
    })

    afterEach(async() => {
        server.close();
        await mongoose.disconnect()
    });

    // filterQuestionsBySearch
    test('filter question empty string', () => {
        const result = filterQuestionsBySearch(_questions, '');

        expect(result.length).toEqual(4);
    });

    test('filter question by one tag', () => {
        const result = filterQuestionsBySearch(_questions, '[android]');

        expect(result.length).toEqual(1);
        expect(result[0]._id).toEqual('65e9b58910afe6e94fc6e6dc');
    });

    // getQuestionsByOrder
    test('get active questions, newest questions sorted by most recently answered 1', async () => {
        mockingoose(Question).toReturn(_questions.slice(0, 3), 'find');

        const result = await getQuestionsByOrder('active');

        expect(result.length).toEqual(3);
        expect(result[0]._id.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result[1]._id.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[2]._id.toString()).toEqual('65e9b9b44c052f0a08ecade0');
    });

    test('get active questions, newest questions sorted by most recently answered 2', async () => {
        const questions = [{
            _id: '65e9b716ff0e892116b2de01',
            answers: [_ans1, _ans3], // 18, 19 => 19
            ask_date_time: new Date('2023-11-20T09:24:00')
        },
        {
            _id: '65e9b716ff0e892116b2de02',
            answers: [_ans1, _ans2, _ans3, _ans4], // 18, 20, 19, 19 => 20
            ask_date_time: new Date('2023-11-20T09:24:00')
        },
        {
            _id: '65e9b716ff0e892116b2de03',
            answers: [_ans1], // 18 => 18
            ask_date_time: new Date('2023-11-19T09:24:00')
        },
        {
            _id: '65e9b716ff0e892116b2de04',
            answers: [_ans4], // 19 => 19
            ask_date_time: new Date('2023-11-21T09:24:00')
        },
        {
            _id: '65e9b716ff0e892116b2de05',
            answers: [],
            ask_date_time: new Date('2023-11-19T10:24:00')
        }
        ]
        mockingoose(Question).toReturn(questions, 'find');

        const result = await getQuestionsByOrder('active');

        expect(result.length).toEqual(5);
        expect(result[0]._id.toString()).toEqual('65e9b716ff0e892116b2de02');
        expect(result[1]._id.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[2]._id.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[3]._id.toString()).toEqual('65e9b716ff0e892116b2de03');
        expect(result[4]._id.toString()).toEqual('65e9b716ff0e892116b2de05');
    })

    test('get active questions, sorted by most recently answered, 2 Questions with no answers', async () => {
        const questions = [{
            _id: '65e9b716ff0e892116b2de01',
            answers: [_ans1, _ans3], // 18, 19 => 19
            ask_date_time: new Date('2023-11-20T09:24:00')
        },
            {
                _id: '65e9b716ff0e892116b2de02',
                answers: [_ans1, _ans2, _ans3, _ans4], // 18, 20, 19, 19 => 20
                ask_date_time: new Date('2023-11-20T09:24:00')
            },
            {
                _id: '65e9b716ff0e892116b2de03',
                answers: [_ans1], // 18 => 18
                ask_date_time: new Date('2023-11-19T09:24:00')
            },
            {
                _id: '65e9b716ff0e892116b2de04',
                answers: [], // 19 => 19
                ask_date_time: new Date('2023-11-21T09:24:00')
            },
            {
                _id: '65e9b716ff0e892116b2de05',
                answers: [],
                ask_date_time: new Date('2023-11-19T10:24:00')
            }
        ]
        mockingoose(Question).toReturn(questions, 'find');

        const result = await getQuestionsByOrder('active');

        expect(result.length).toEqual(5);
        expect(result[0]._id.toString()).toEqual('65e9b716ff0e892116b2de02');
        expect(result[1]._id.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[2]._id.toString()).toEqual('65e9b716ff0e892116b2de03');
        expect(result[3]._id.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[4]._id.toString()).toEqual('65e9b716ff0e892116b2de05');
    })

    test('get newest unanswered questions', async () => {
        mockingoose(Question).toReturn(_questions, 'find');

        const result = await getQuestionsByOrder('unanswered');

        expect(result.length).toEqual(2)
        expect(result[0]._id.toString()).toEqual('65e9b716ff0e892116b2de09');
        expect(result[1]._id.toString()).toEqual('65e9b9b44c052f0a08ecade0');
    });

    test('get newest questions', async () => {
        const questions = [{
            _id: '65e9b716ff0e892116b2de01',
            ask_date_time: new Date('2023-11-20T09:24:00')
        },
        {
            _id: '65e9b716ff0e892116b2de04',
            ask_date_time: new Date('2023-11-21T09:24:00')
        },
        {
            _id: '65e9b716ff0e892116b2de05',
            ask_date_time: new Date('2023-11-19T10:24:00')
        }
        ]
        mockingoose(Question).toReturn(questions, 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(3);
        expect(result[0]._id.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[1]._id.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[2]._id.toString()).toEqual('65e9b716ff0e892116b2de05');
    })

    test('error returned in response if error encountered executing getQuestionsByFilter', async () => {
        Question.find = jest.fn().mockImplementation({
            populate: jest.fn().mockRejectedValue(new Error("Unable to find Question."))
        });

        let response = await supertest(server)
          .get("/question/getQuestion")
        expect(response.status).toBe(500);
        expect(response.body).toEqual({error: "Failed to find questions."})
    })
})