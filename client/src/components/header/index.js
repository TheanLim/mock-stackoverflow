import "./index.css";
import { useState } from "react";
import { logOutUser } from "../../services/userService";
import AccountButtons from "./accountButtons";

const Header = ({search, setQuestionPage, updateAppStatus, loggedIn, updateUser, csrfToken, setCsrfToken}) => {
  const [val, setVal] = useState(search);

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
      <AccountButtons
        loggedIn={loggedIn}
        updateAppStatus={updateAppStatus}
        updateUser={updateUser}
        setCsrfToken={setCsrfToken}
        csrfToken={csrfToken}
      />
    </div>
  );
};

Header.logOutUser = logOutUser;
export default Header;
