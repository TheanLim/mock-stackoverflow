import {useState} from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import Textarea from "../baseComponents/textarea";
import "./index.css";
import {validateHyperlink} from "../../../tool";

import {addQuestion} from "../../../services/questionService";
import ActionButton from "../baseComponents/button";

const NewQuestion = ({handleQuestions}) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tag, setTag] = useState("");

  const [titleErr, setTitleErr] = useState("");
  const [textErr, setTextErr] = useState("");
  const [tagErr, setTagErr] = useState("");

  const validateTitle = () => {
    if (!title) {
      setTitleErr("Title cannot be empty");
      return false;
    } else if (title.length > 100) {
      setTitleErr("Title cannot be more than 100 characters");
      return false;
    }
    return true;
  }

  const validateText = () => {
      if (!text) {
          setTextErr("Question text cannot be empty");
          return false;
      }

      // Hyperlink validation
      if (!NewQuestion.validateHyperlink(text)) {
          setTextErr("Invalid hyperlink format.");
          return false;
      }
      return true;
  }

  const validateTags = (tags) => {
      if (tags.length === 0) {
          setTagErr("Should have at least 1 tag");
          return false;
      } else if (tags.length > 5) {
          setTagErr("Cannot have more than 5 tags");
          return false;
      }

      for (let tag of tags) {
          if (tag.length > 20) {
              setTagErr("New tag length cannot be more than 20");
              return false;
          }
      }
      return true;
  }

  const postQuestion = async () => {
    let isValid = true;
    isValid = validateTitle() && isValid;
    isValid = validateText() && isValid;

    let tags = Array.from(new Set(tag.split(" ").filter(tag => tag.trim() !== "")));
    isValid = validateTags(tags) && isValid;

    if (!isValid) {
      return;
    }

    const question = {
      title: title,
      text: text,
      tags: tags,
      ask_date_time: new Date(),
      status: 'open',
      score: 0,
    };

    const res = await NewQuestion.addQuestion(question);
    if (res.error === "Not enough reputation to create new tags.") {
      setTagErr(res.error);
    } else {
      if (res && res._id) {
        handleQuestions();
      }
    }
  };

  return (
    <Form>
      <Input
        title={"Question Title"}
        hint={"Limit title to 100 characters or less"}
        id={"formTitleInput"}
        val={title}
        setState={setTitle}
        err={titleErr}
      />
      <Textarea
        title={"Question Text"}
        hint={"Add details"}
        id={"formTextInput"}
        val={text}
        setState={setText}
        err={textErr}
      />
      <Input
        title={"Tags"}
        hint={"Add keywords separated by whitespace"}
        id={"formTagInput"}
        val={tag}
        setState={setTag}
        err={tagErr}
      />
      <div className="btn_indicator_container">
        <ActionButton
          styling="form_postBtn"
          buttonText="Post Question"
          clickMethod={postQuestion}
        />
        <div className="mandatory_indicator">
          * indicates mandatory fields
        </div>
      </div>
    </Form>
  );
};

NewQuestion.addQuestion = addQuestion;
NewQuestion.validateHyperlink = validateHyperlink;
export default NewQuestion;
