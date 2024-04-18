import "./index.css";

const ActionButton = ({ buttonText, clickMethod, styling }) => {
  return (
    <button
      className={styling}
      onClick={clickMethod}
    >
      {buttonText}
    </button>
  );
};

export default ActionButton;
