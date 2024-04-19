import "./index.css";
import {useState} from "react";
import Form from "../baseComponents/form";
import Textarea from "../baseComponents/textarea";
import {validateHyperlink} from "../../../tool";
import {addAnswer} from "../../../services/answerService";
import ActionButton from "../baseComponents/button";

const NewAnswer = ({qid, handleAnswer}) => {
  const [text, setText] = useState("");
  const [textErr, setTextErr] = useState("");

  const validateAnswer = () => {
    if (!text) {
      setTextErr("Answer text cannot be empty");
      return false;
    }

    // Hyperlink validation
    if (!NewAnswer.validateHyperlink(text)) {
      setTextErr("Invalid hyperlink format.");
      return false;
    }
    return true;
  }
  const postAnswer = async () => {

    if (!validateAnswer()) {
      return;
    }

    const answer = {
      text: text,
      ans_date_time: new Date(),
      score: 0,
    };

    const res = await NewAnswer.addAnswer(qid, answer);
    if (res && res._id) {
      handleAnswer(qid);
    }
  };
  return (
    <Form>
      <Textarea
        title={"Answer Text"}
        id={"answerTextInput"}
        val={text}
        setState={setText}
        err={textErr}
      />
      <div className="btn_indicator_container">
        <ActionButton
          styling="form_postBtn"
          buttonText="Post Answer"
          clickMethod={postAnswer}
        />
        <div className="mandatory_indicator">
          * indicates mandatory fields
        </div>
      </div>
    </Form>
  );
};

NewAnswer.addAnswer = addAnswer;
NewAnswer.validateHyperlink = validateHyperlink;
export default NewAnswer;
