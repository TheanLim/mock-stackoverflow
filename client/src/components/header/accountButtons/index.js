import { logOutUser } from "../../../services/userService";
import ActionButton from "../../main/baseComponents/button";
import './index.css';

const AccountButtons = ({ loggedIn, updateAppStatus, updateUser, csrfToken, setCsrfToken }) => {

  const signOutUser = async () => {
    await AccountButtons.logOutUser(csrfToken);
    updateUser(null);
    setCsrfToken("");
    updateAppStatus("logging_out");
  }

  const renderLoginBtn = () => {
    return (
      <ActionButton
        styling="bluebtn"
        clickMethod={() => updateAppStatus("started_login")}
        buttonText="Sign In"
      />
    );
  }

  const renderLoggedInBtns = () => {
    return (
      <div className="btn-container">
        <ActionButton
          styling="bluebtn"
          clickMethod={() => updateAppStatus("viewing_self_profile")}
          buttonText="Profile"
        />
        <ActionButton
          styling="bluebtn"
          clickMethod={signOutUser}
          buttonText="Sign Out"
        />
      </div>
    );
  }

  if (loggedIn) {
    return renderLoggedInBtns();
  } else {
    return renderLoginBtn()
  }
}

AccountButtons.logOutUser = logOutUser;
export default AccountButtons;