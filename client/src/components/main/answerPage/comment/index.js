import "./index.css";
import {handleHyperlink, validateHyperlink} from "../../../../tool";
import { useEffect, useState } from "react";
import { isAuthorizedToComment } from "../../../../services/commentService";
import { isAuthorizedToVote } from "../../../../services/voteService";
import Snackbar from "../../baseComponents/snackbar";
import ActionButton from "../../baseComponents/button";
import FlagCommentButton from "./flagcommentbutton";
import UpvoteCommentButton from "./upvotecommentbutton"; 

const Comment = (
    {
        parentPostType, parentId, 
        cid, text, commentBy, meta, votes, score, 
        handleAddComment, handleVote,
        user, handleLogin, handleProfile
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
                res = await Comment.isAuthorizedToVote('flag');
                setIsAuthorizedToFlag(res || false);
    
                res = await Comment.isAuthorizedToVote('upvote');
                setIsAuthorizedToUpvote(res || false);
            };
    
            checkVoteAuthorization().catch((e) => console.log(e));
        } else {
            setIsAuthorizedToFlag(false);
            setIsAuthorizedToUpvote(false);
        }
    }, [user]);

    const validateCommentAdd = () => {
        if (!Comment.validateHyperlink(val)) {
            setSnackbarMessage("Invalid hyperlink format.");
        } else {
            handleAddComment(parentPostType, parentId, val);
            setVal('');
            setShowCommentButton(true);
        }
    }
    
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
    
    return (
        <div className="Comment">
            {text && (
                <div className="comment">
                    {votes && (
                        <div className="comment_score">
                            {score}
                        </div>
                    )}
                    <div className="vote_flag">
                        { isAuthorizedToUpvote &&
                            <UpvoteCommentButton cid={cid} handleVote={handleVote} isUpvoted={isUpvoted} isUserPostOwner={isUserPostOwner}/>
                        }
                        { isAuthorizedToFlag &&
                            <FlagCommentButton cid={cid} handleVote={handleVote} isFlagged={isFlagged} isUserPostOwner={isUserPostOwner}/>
                        }
                    </div>
                    <div id="comment_text" className="comment_text">
                        {Comment.handleHyperlink(text)}
                        <div className="comment_details"
                             onClick={() => {
                                 handleProfile(commentBy._id);
                             }}
                        >
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
              <ActionButton
                  styling="comment_button"
                  clickMethod={async() => {
                      if (!user) handleLogin();
                      else {
                          let res = await Comment.isAuthorizedToComment();
                          if (res.error) setSnackbarMessage(res.error)
                          else setShowCommentButton(false);
                      }
                  }}
                  buttonText="Add a comment"
              />
            }

            {snackbarMessage && (
                <Snackbar message={snackbarMessage} durationMilliseconds={3000} onClose={()=>{setSnackbarMessage('')}} />
            )}

            {!text && !showCommentButton &&
                <textarea
                    placeholder="Comment here...Press Esc to cancel"
                    type="text"
                    className="comment-textarea"
                    value={val}
                    onChange={(e) => {
                        setVal(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            validateCommentAdd();
                        }
                        if (e.key === "Escape") {
                            setShowCommentButton(true);
                        }
                    }}
                    style={{ width: "75%" }} 
                />
            }
        </div>
    );
};

Comment.isAuthorizedToComment = isAuthorizedToComment;
Comment.isAuthorizedToVote = isAuthorizedToVote;
Comment.handleHyperlink = handleHyperlink;
Comment.validateHyperlink = validateHyperlink;
export default Comment;