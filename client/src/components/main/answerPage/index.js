import { useEffect, useState } from "react";
import { getMetaData, loginWrapper } from "../../../tool";
import AnswerHeader from "./header";
import Post from "./post";
import "./index.css";
import { getQuestionById } from "../../../services/questionService";
import { addVoteToAnswer, addVoteToQuestion, addVoteToComment } from "../../../services/voteService";
import { addCommentToAnswer, addCommentToQuestion } from "../../../services/commentService";
import { markAnswerAsSolution } from "../../../services/answerService";
import Snackbar from "../baseComponents/snackbar";

// Component for the Answers page
const AnswerPage = ({ qid, handleNewQuestion, handleNewAnswer, user, handleLogin }) => {
    const [question, setQuestion] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    let withLogin = loginWrapper(user, handleLogin);

    const fetchData = async (shouldIncrementView) => {
        let res = await AnswerPage.getQuestionById(qid, shouldIncrementView);
        setQuestion(res || null); 
        if(!res) setSnackbarMessage("Question does not exist. Please head back to the Main Page.")
        console.log('Fetch Data');
        console.log(res);
    };

    useEffect(() => {
        fetchData(true).catch((e) => console.log(e));
    }, [qid, user]);

    const handleSnackbarClose = () => {
        setSnackbarMessage('');
    };

    const handleResponse = (res) => {
        if (res && res.error) {
            setSnackbarMessage(res.error);
        }
        fetchData(false).catch(console.log);
    }

    const handleVote = withLogin(async(itemType, itemId, voteType) => {
        let res;
        switch(voteType){
            case 'upvote':
            case 'downvote':
            case 'flag':
                if (itemType === 'answer') res = await AnswerPage.addVoteToAnswer(itemId, voteType);
                else if (itemType === 'question') res = await AnswerPage.addVoteToQuestion(itemId, voteType);
                else if (itemType === 'comment') res = await AnswerPage.addVoteToComment(itemId, voteType);
                break;
            case 'close':
            case 'reopen':
                // close and reopen only applies to Question
                res = await AnswerPage.addVoteToQuestion(itemId, voteType);
                break;
        }
        handleResponse(res)
    });

    const handleAddComment = withLogin(async(parentItemType, itemId, comment) => {
        let res;
        if (parentItemType === 'answer') res = await AnswerPage.addCommentToAnswer(itemId, comment);
        else if (parentItemType === 'question') res = await AnswerPage.addCommentToQuestion(itemId, comment);
        handleResponse(res)
    });

    const handleMarkSolution = withLogin(async(aid) => {
        let res;
        res = await AnswerPage.markAnswerAsSolution(qid, aid);
        handleResponse(res)
    });

    return (
        <>  
            {snackbarMessage && (
                <Snackbar message={snackbarMessage} durationMilliseconds={3000} onClose={handleSnackbarClose} />
            )}
            {question && 
                <>
                    <AnswerHeader
                        ansCount={
                            question && question.answers && question.answers.length
                        }
                        title={question && question.status === 'closed'? `${question.title} [closed]`: question.title}
                        handleNewQuestion={handleNewQuestion}
                    />
                    <Post
                        postType={"question"}
                        pid={question._id}
                        views={question && question.views}
                        text={question && question.text}
                        postBy={question && question.asked_by}
                        meta={question && getMetaData(new Date(question.ask_date_time))}
                        comments={question.comments}
                        score={question.score}
                        votes={question.votes}
                        status={question.status}
                        user={user}
                        handleVote={handleVote}
                        handleLogin={handleLogin}
                        handleAddComment={handleAddComment}
                        handleMarkSolution={handleMarkSolution}
                    />
                    {question &&
                        question.answers &&
                        question.answers.map(a => {
                        return <Post
                            key={a._id}
                            pid={a._id}
                            postType={"answer"}
                            text={a.text}
                            postBy={a.ans_by}
                            meta={getMetaData(new Date(a.ans_date_time))}
                            comments={a.comments}
                            score={a.score}
                            votes={a.votes}
                            user={user}
                            isSolution={(question.solution && a._id===question.solution._id)?true:false}
                            parentPostBy={question.asked_by}
                            handleVote={handleVote}
                            handleLogin={handleLogin}
                            handleAddComment={handleAddComment}
                            handleMarkSolution={handleMarkSolution}
                        />
                        })}
                    {question.status === 'open' &&
                        <button
                            className="bluebtn ansButton"
                            onClick={() => {
                                handleNewAnswer();
                            }}
                        >
                            Answer Question
                        </button>
                    }
                </>
            }
        </>
    );
};

AnswerPage.getQuestionById = getQuestionById;
AnswerPage.addVoteToAnswer = addVoteToAnswer;
AnswerPage.addVoteToQuestion = addVoteToQuestion;
AnswerPage.addCommentToAnswer = addCommentToAnswer;
AnswerPage.addCommentToQuestion = addCommentToQuestion;
AnswerPage.markAnswerAsSolution = markAnswerAsSolution;
AnswerPage.addVoteToComment = addVoteToComment;
export default AnswerPage;