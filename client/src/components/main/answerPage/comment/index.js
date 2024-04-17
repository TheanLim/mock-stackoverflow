import "./index.css";
import { handleHyperlink } from "../../../../tool";
import { useEffect, useState } from "react";
import { isAuthorizedToComment } from "../../../../services/commentService";
import { isAuthorizedToVote } from "../../../../services/voteService";
import Snackbar from "../../baseComponents/snackbar";
import { IoCaretUp } from "react-icons/io5";
import { IoFlagSharp } from "react-icons/io5";


const Comment = (
    {
        parentPostType, parentId, 
        cid, text, commentBy, meta, votes, score, 
        handleAddComment, handleVote,
        user, handleLogin
    }) => {
    const [showCommentButton, setShowCommentButton] = useState(true)
    const [val, setVal] = useState('')
    let isUpvoted = false;
    let isFlagged = false;
    let commentUser = user?user:true
    const userId = user || null;
    const isUserPostOwner = userId && commentBy && userId === commentBy._id;
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [isAuthorizedToFlag, setIsAuthorizedToFlag] = useState(false);
    const [isAuthorizedToUpvote, setIsAuthorizedToUpvote] = useState(false);
    
    useEffect(() => {
        if (user) {
            const checkVoteAuthorization = async () => {
                let res;
                res = await isAuthorizedToVote('flag');
                setIsAuthorizedToFlag(res || false);
    
                res = await isAuthorizedToVote('upvote');
                setIsAuthorizedToUpvote(res || false);
            };
    
            checkVoteAuthorization().catch((e) => console.log(e));
        } else {
            setIsAuthorizedToFlag(false);
            setIsAuthorizedToUpvote(false);
        }
    }, [user]);
    
    // Only show flag and upvote related to the current user.
    if (votes && votes.length > 0) {
        for (const vote of votes) {
            if (vote && vote.vote_type === 'upvote' && vote.voter===commentUser){
                isUpvoted = true;
            } else if (vote.vote_type === 'flag' && vote.voter===commentUser){
                isFlagged=true;
            }
            if (isUpvoted && isFlagged) break;
        }
    }

    const upvoteClass = (isUpvoted ? 'upvote-black': 'upvote-transparent') + (isUserPostOwner?' no-hover': '')
    const flagClass = (isFlagged ? 'flag-black': 'flag-transparent') + (isUserPostOwner?' no-hover': '')
    
    return (
        <>
            {text && (
                <div className="comment">
                    {votes && (
                        <div className="comment_score">
                            {score}
                        </div>
                    )}
                    <div className="vote_flag">
                        { isAuthorizedToUpvote &&
                            <button className="upvote" onClick={() => { handleVote("comment", cid, 'upvote')}} disabled={isUserPostOwner} >
                                <IoCaretUp className={upvoteClass}/>
                            </button>
                        }
                        { isAuthorizedToFlag &&
                            <button className="flag" onClick={() => { handleVote("comment", cid, 'flag')}} disabled={isUserPostOwner} >
                                <IoFlagSharp className={flagClass}/>
                            </button>
                        }
                    </div>
                    <div id="comment_text" className="comment_text">
                        {handleHyperlink(text)}
                        <div className="comment_details">
                            <div className="comment_dash">-</div>
                            <div className="comment_author">
                                {`${commentBy && commentBy.display_name}`}
                            </div>
                            <div className="comment_meta">{` ${meta}`}</div>
                        </div>
                    </div>
                </div>
            )}
            {!text && showCommentButton &&
                <button
                    className="comment_button"
                    onClick={async() => {
                        if (!user) handleLogin();
                        else {
                            let res = await Comment.isAuthorizedToComment();
                            if (res.error) setSnackbarMessage(res.error)
                            else setShowCommentButton(false);
                        }
                    }}
                >
                    Add a comment
                </button>
            }

            {snackbarMessage && (
                <Snackbar message={snackbarMessage} durationMilliseconds={3000} onClose={()=>{setSnackbarMessage('')}} />
            )}

            {!text && !showCommentButton &&
                <textarea
                    placeholder="Comment here...Press Esc to cancel"
                    type="text"
                    value={val}
                    onChange={(e) => {
                        setVal(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddComment(parentPostType, parentId, val);
                            setVal('');
                            setShowCommentButton(true);
                        }
                        if (e.key === "Escape") {
                            setShowCommentButton(true);
                        }
                    }}
                    style={{ width: "75%" }} 
                />
            }
        </>
    );
};

Comment.isAuthorizedToComment = isAuthorizedToComment;
export default Comment;