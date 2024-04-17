import { REACT_APP_API_URL, api } from "./config";

const ANSWER_API_URL = `${REACT_APP_API_URL}/answer`;

// To add answer
const addAnswer = async (qid, ans) => {
    const data = { qid: qid, ans: ans };
    const res = await api.post(`${ANSWER_API_URL}/addAnswer`, data);
    return res.data;
};

// To mark Answer with aid as the solution for Question with qid
const markAnswerAsSolution = async (qid, aid) => {
    const data = { qid: qid, aid: aid };
    const res = await api.post(`${ANSWER_API_URL}/markAnswerAsSolution`, data);
    return res.data;
}

export { addAnswer, markAnswerAsSolution };
