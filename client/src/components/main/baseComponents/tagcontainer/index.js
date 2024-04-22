import "./index.css";
import ActionButton from "../button";

export const TagContainer = ({ tags, clickMethod }) => {
  return (
    <div className="question_tags">
      {tags.map((tag, idx) => {
        return (
          <ActionButton
            key={idx}
            clickMethod={(e) => {
              e.stopPropagation();
              clickMethod(tag.name);
            }}
            buttonText={tag.name}
            styling="question_tag_button"
          />
        );
      })}
    </div>
  );
}

export default TagContainer;
