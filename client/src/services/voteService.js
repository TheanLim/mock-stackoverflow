import { REACT_APP_API_URL, api } from "./config";

const VOTE_API_URL = `${REACT_APP_API_URL}/vote`;

// To add vote to a Question by the qid
const addVoteToQuestion = async (qid, voteType, voteReason='') => {
    const data = { id: qid, vote_type: voteType, vote_reason:voteReason};
    const res = await api.post(`${VOTE_API_URL}/addVoteToQuestion`, data);
    return res.data || res.response.data;
};

// To add vote to a Answer by the aid
const addVoteToAnswer = async (aid, voteType, voteReason='') => {
    const data = { id: aid, vote_type: voteType, vote_reason:voteReason};
    const res = await api.post(`${VOTE_API_URL}/addVoteToAnswer`, data);
    return res.data || res.response.data;
};

// To add vote to a Comment by the cid
const addVoteToComment = async (cid, voteType) => {
    const data = { id: cid, vote_type: voteType};
    const res = await api.post(`${VOTE_API_URL}/addVoteToComment`, data);
    return res.data || res.response.data;
};

const isAuthorizedToVote = async (voteType) => {
    // Assumed req session is set.
    const res = await api.get(`${VOTE_API_URL}/isAuthorizedToVote/${voteType}`);
    return res.data || res.response.data;
};


export { addVoteToQuestion, addVoteToAnswer, addVoteToComment, isAuthorizedToVote };