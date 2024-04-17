import "./index.css";
import { useState } from "react";
import { logOutUser } from "../../services/userService";

const Header = ({search, setQuestionPage, updateAppStatus, loggedIn, updateUser, csrfToken, setCsrfToken}) => {
  const [val, setVal] = useState(search);

  const signOutUser = async () => {
    await Header.logOutUser(csrfToken);
    updateUser(null);
    setCsrfToken("");
    updateAppStatus("logging_out");
  }

  const renderLoginBtn = () => {
    return (
      <button
        className="bluebtn"
        onClick={() => {
          updateAppStatus("started_login");
        }}
      >
        Sign In
      </button>
    );
  }

  const renderLoggedInBtns = () => {
    return (
      <div className="btn-container">
        <button
          className="bluebtn"
          onClick={() => {
            updateAppStatus("viewing_self_profile");
          }}
        >
          Profile
        </button>
        <button
          className="bluebtn"
          onClick={() => {
            signOutUser();
          }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div id="header" className="header">
      <div></div>
      <div className="title">Fake Stack Overflow</div>
      <input
        id="searchBar"
        placeholder="Search ..."
        type="text"
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            setQuestionPage(e.target.value, "Search Results");
          }
        }}
      />
      {(loggedIn) ? renderLoggedInBtns() : renderLoginBtn()}
    </div>
  );
};

Header.logOutUser = logOutUser;
export default Header;
