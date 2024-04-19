import "./index.css";    
import { IoFlagSharp } from "react-icons/io5";

const FlagCommentButton = ({cid, handleVote, isFlagged, isUserPostOwner})=> {
    const flagClass = (isFlagged ? 'flag-black': 'flag-transparent') + (isUserPostOwner?' no-hover': '')

    return (
        <button className="flag" onClick={() => { handleVote("comment", cid, 'flag')}} disabled={isUserPostOwner} >
            <IoFlagSharp className={flagClass}/>
        </button>
    )
}

export default FlagCommentButton;