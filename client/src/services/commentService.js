import { REACT_APP_API_URL, api } from "./config";

const COMMENT_API_URL = `${REACT_APP_API_URL}/comment`;

//To add a comment to a Question by qid
const addCommentToQuestion = async (qid, comment) => {
    const data = { id: qid, text: comment};
    const res = await api.post(`${COMMENT_API_URL}/addCommentToQuestion`, data);
    return res.data || res.response.data;
};

//To add a comment to a Answer by qid
const addCommentToAnswer = async (aid, comment) => {
    const data = { id: aid, text: comment};
    const res = await api.post(`${COMMENT_API_URL}/addCommentToAnswer`, data);
    return res.data || res.response.data;
};

const isAuthorizedToComment = async () => {
    // Assumed req session is set.
    const res = await api.get(`${COMMENT_API_URL}/isAuthorizedToComment`);
    return res.data || res.response.data;
};


export { addCommentToQuestion, addCommentToAnswer, isAuthorizedToComment };