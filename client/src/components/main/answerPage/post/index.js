import { handleHyperlink, getMetaData } from "../../../../tool";
import { useEffect, useState } from "react";
import { isAuthorizedToVote } from "../../../../services/voteService";
import Comment from "../comment";
import "./index.css";
import VotingButtons from "../../baseComponents/votingbuttons";
import { FlaggingButtons } from "../../baseComponents/flaggingbuttons";
import { SolutionButton } from "../../baseComponents/solutionbutton";

const voteTypeCnt = (votes, voteType) => {
    return (votes || []).filter(vote => vote.vote_type === voteType).length;
}

// Component for the Answer Page
// A post could be a Question or an Answer Post
const Post = ({ postType, pid, views, text, postBy, meta, comments,
                  score, votes, status, user, isSolution, parentPostBy,
                  handleVote, handleLogin, handleAddComment, handleMarkSolution, handleProfile }) => {
    const [isAuthorizedToFlag, setIsAuthorizedToFlag] = useState(false);
    const [isAuthorizedToCloseReopen, setIsAuthorizedToCloseReopen] = useState(false);

    const userId = user || null;
    const userVoteUpDownVote = (userId && votes)
        ? votes.find(vote => vote.voter === userId && ['upvote', 'downvote'].includes(vote.vote_type))
        : null;
    const userUpDownVoteType = userVoteUpDownVote ? userVoteUpDownVote.vote_type : null;
    const isUserPostOwner = userId && postBy && userId === postBy._id;

    const flaggedCnt = voteTypeCnt(votes, 'flag')
    const closeReopenCnt = voteTypeCnt(votes, 'close') + voteTypeCnt(votes, 'reopen')

    useEffect(() => {
        if (user) {
            const checkVoteAuthorization = async () => {
                let res;
                res = await Post.isAuthorizedToVote('flag');
                setIsAuthorizedToFlag(res === true || false);
                res = await Post.isAuthorizedToVote('close'); // same reputation as reopen
                setIsAuthorizedToCloseReopen(res === true || false);
            };
    
            checkVoteAuthorization().catch((e) => console.log(e));
        } else {
            setIsAuthorizedToFlag(false);
            setIsAuthorizedToCloseReopen(false);
        }
    }, [user]);
    
    return (
        <div className="post_comment_container">
            <div className="post_comment_left">
                <VotingButtons isUserPostOwner={isUserPostOwner} handleVote={(type) => handleVote(postType, pid, type)} userVoteType={userUpDownVoteType} score={score} />
                <SolutionButton postType={postType} userId={userId} parentPostBy={parentPostBy} pid={pid} isSolution={isSolution} handleMarkSolution={handleMarkSolution} />
            </div>
            <div className="post_comment_main">
                {views && <div className="bold_title post_view">{views} views</div>}
                <div className="post">
                    <div id="postText" className="postText">
                        {handleHyperlink(text)}
                    </div>
                    <div className="postAuthor"
                         onClick={() => {
                             handleProfile(postBy._id);
                         }}
                    >
                        <div className="post_author">{postBy && postBy.display_name}</div>
                        <div className="post_question_meta">{postType==="question"?'asked':''} {meta}</div>
                    </div>
                </div>
                <div className='flag_close_reopen_container'>
                    <FlaggingButtons 
                        handleVote={handleVote} 
                        postType={postType} 
                        pid={pid} 
                        status={status}
                        flaggedCnt={flaggedCnt} 
                        closeReopenCnt={closeReopenCnt} 
                        isUserPostOwner={isUserPostOwner} 
                        isAuthorizedToFlag={isAuthorizedToFlag} 
                        isAuthorizedToCloseReopen={isAuthorizedToCloseReopen}
                    />
                </div>
                {comments && comments.map((c, idx) => (
                        <Comment
                            key={idx}
                            parentPostType={postType}
                            parentId = {pid}
                            cid = {c._id}
                            text={c.text}
                            commentBy={c.comment_by}
                            meta={getMetaData(new Date(c.comment_date_time))}
                            votes={c.votes}
                            score={c.score}
                            handleAddComment={handleAddComment}
                            handleVote={handleVote}
                            user={user}
                            handleLogin={handleLogin}
                            handleProfile={handleProfile}
                        />
                    ))
                }
                <Comment parentPostType={postType} parentId={pid} handleAddComment={handleAddComment} handleVote={handleVote} user={user} handleLogin={handleLogin} />
            </div>
        </div>
    );
};

Post.isAuthorizedToVote = isAuthorizedToVote
export default Post;