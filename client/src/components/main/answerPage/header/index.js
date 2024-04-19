import "./index.css";
import ActionButton from "../../baseComponents/button";

// Header for the Answer page
const AnswerHeader = ({ ansCount, title, handleNewQuestion }) => {
    return (
        <div id="answersHeader" className="space_between right_padding">
            <div className="bold_title">{ansCount} answers</div>
            <div className="bold_title answer_question_title">{title}</div>
          <ActionButton
            styling="bluebtn"
            clickMethod={handleNewQuestion}
            buttonText="Ask a Question"
          />
        </div>
    );
};

export default AnswerHeader;
