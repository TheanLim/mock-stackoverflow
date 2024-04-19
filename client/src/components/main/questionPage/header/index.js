import "./index.css";
import ActionButton from "../../baseComponents/button";

const QuestionHeader = ({
                          title_text,
                          qcnt,
                          setQuestionOrder,
                          handleNewQuestion,
                        }) => {
  return (
    <div>
      <div className="space_between right_padding">
        <div className="bold_title">{title_text}</div>
        <ActionButton
          styling="bluebtn"
          buttonText="Ask a Question"
          clickMethod={handleNewQuestion}
        />
      </div>
      <div className="space_between right_padding">
        <div id="question_count">{qcnt} questions</div>
        <div className="btns">
          {["Newest", "Active", "Unanswered"].map((m, idx) => (
            <ActionButton
              key={idx}
              styling="btn"
              buttonText={m}
              clickMethod={()=>{setQuestionOrder(m)}}
            />
           
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionHeader;
