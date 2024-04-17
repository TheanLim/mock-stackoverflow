import './index.css'
import { ImCheckmark } from 'react-icons/im';

export const SolutionButton = ({ postType, userId, parentPostBy, pid, isSolution, handleMarkSolution }) => {
    const isUserQuestionOwner = postType === "answer" && userId && userId === parentPostBy._id;
    const iconClass = isSolution ? "solution-btn-icon-green" : "solution-btn-icon-transparent";

    return (
        <>
            {isUserQuestionOwner && (
                <button className="solution-btn" onClick={() => handleMarkSolution(pid)}>
                    <ImCheckmark className={iconClass} />
                </button>
            )}
            {!isUserQuestionOwner && isSolution && (
                <button className="solution-btn" disabled={true}>
                    <ImCheckmark className={iconClass} />
                </button>
            )}
        </>
    );
};

export default SolutionButton;