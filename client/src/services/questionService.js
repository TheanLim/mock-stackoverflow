import { REACT_APP_API_URL, api } from "./config";

const QUESTION_API_URL = `${REACT_APP_API_URL}/question`;

// To get Questions by Filter
const getQuestionsByFilter = async (order = "newest", search = "") => {
    const res = await api.get(
        `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`
    );

    return res.data;
};

// To get Questions by id
const getQuestionById = async (qid, incrementView = true) => {
    let res;
    if (incrementView) {
        res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}`);
    } else {
        res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}?incrementView=false`);
    }

    return res.data;
};

// To add Questions
const addQuestion = async (q) => {
    const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q);

    return res.data || res.response.data;
};

export { getQuestionsByFilter, getQuestionById, addQuestion };
