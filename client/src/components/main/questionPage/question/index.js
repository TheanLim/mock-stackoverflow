import {getMetaData} from "../../../../tool";
import "./index.css";
import TagContainer from "../../baseComponents/tagcontainer";

const Question = ({q, clickTag, handleAnswer, handleProfile}) => {
  return (
    <div className="question right_padding">
      <div className="postStats">
        <div>{q.answers.length || 0} answers</div>
        <div>{q.views} views</div>
      </div>
      <div
        className="question_mid"
        onClick={() => {
          handleAnswer(q._id);
        }}
      >
        <div className="postTitle">{q.status === 'closed' ? `${q.title} [closed]` : q.title}</div>
        <div className="question_tags">
          <TagContainer
            tags={q.tags}
            clickMethod={clickTag}
          />
        </div>
      </div>
      <div
        className="lastActivity"
        onClick={() => {
          handleProfile(q.asked_by._id);
        }}
      >
        <div className="question_author">{q.asked_by && q.asked_by.display_name}</div>
        <div>&nbsp;</div>
        <div className="question_meta">
          asked {getMetaData(new Date(q.ask_date_time))}
        </div>
      </div>
    </div>
  );
};

export default Question;
