import "./index.css";
export const VotingButtons = ({ isUserPostOwner, handleVote, userVoteType, score }) => {

    // Button styles based on user vote type
    const getButtonStyles = (type, isOwner) => {
        const bg = userVoteType === type ? "green-bg" : "white-bg";
        const opacity = isOwner ? "half-opaque" : "full-opaque";
        return `${type}_button up_down_button ${bg} ${opacity}`;
    };

    return (
        <>
            <button className={getButtonStyles("upvote", isUserPostOwner)} onClick={() => handleVote("upvote")} disabled={isUserPostOwner} />
            <div className="post_score">{score}</div>
            <button className={getButtonStyles("downvote", isUserPostOwner)} onClick={() => handleVote("downvote")} disabled={isUserPostOwner} />
        </>
    );
};

export default VotingButtons;
