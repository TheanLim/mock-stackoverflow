import "./index.css";    
import { IoCaretUp } from "react-icons/io5";

const UpvoteCommentButton = ({cid, handleVote, isUpvoted, isUserPostOwner})=> {
    const upvoteClass = (isUpvoted ? 'upvote-black': 'upvote-transparent') + (isUserPostOwner?' no-hover': '');
    return(
        <button className="upvote" onClick={() => { handleVote("comment", cid, 'upvote')}} disabled={isUserPostOwner} >
            <IoCaretUp className={upvoteClass}/>
        </button>
    )
}

export default UpvoteCommentButton;