import "./index.css";

export const FlaggingButtons = ({ handleVote, postType, pid, status, flaggedCnt, closeReopenCnt, isUserPostOwner, isAuthorizedToFlag, isAuthorizedToCloseReopen }) => (
    <>
        {isAuthorizedToFlag &&
            <button className="flag_close_reopen" onClick={() => handleVote(postType, pid, 'flag')} disabled={isUserPostOwner}>
                {flaggedCnt ? `flag (${flaggedCnt})` : 'flag'}
            </button>}
        {postType === 'question' && isAuthorizedToCloseReopen &&
            <>
                {status === 'open' &&
                    <button className="flag_close_reopen" onClick={() => handleVote(postType, pid, 'close')} disabled={isUserPostOwner}>
                        {closeReopenCnt ? `Close (${closeReopenCnt})` : 'Close'}
                    </button>}
                {status === 'closed' &&
                    <button className="flag_close_reopen" onClick={() => handleVote(postType, pid, 'reopen')} disabled={isUserPostOwner}>
                        {closeReopenCnt ? `Reopen (${closeReopenCnt})` : 'Reopen'}
                    </button>}
            </>}
        <div className="margin_underline"></div>
    </>
);

export default FlaggingButtons;