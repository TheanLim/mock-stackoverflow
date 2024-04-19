import {useCallback, useEffect, useState} from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import "./index.css";

import { getExistingUser, checkLoginStatus, fetchCSRF } from "../../../services/userService";
import ActionButton from "../baseComponents/button";

const Login = ({ handleRedirect, handleRegister, updateUser, csrfToken, setCsrfToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const fetchCsrfToken = useCallback(async () => {
    const response = await Login.fetchCSRF();
    setCsrfToken(response);
  }, []);

  const checkLogin = useCallback(async () => {
    try {
      const response = await Login.checkLoginStatus(csrfToken);
      updateUser(response.user);
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  }, [csrfToken]);

  useEffect(() => {
    const fetchCsrfAndCheckLoginStatus = async () => {
      await fetchCsrfToken();
      await checkLogin();
    };

    // Call the function only when the component mounts
    if (!csrfToken) {
      fetchCsrfAndCheckLoginStatus();
    }
  }, [csrfToken, fetchCsrfToken, checkLogin]);

  const validateEmailInput = () => {
    const emailValidationRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (email.length === 0) {
      setEmailError("You must enter an email.");
      return false;
    } else if (!emailValidationRegex.test(email)) {
      setEmailError("Invalid Email Format.");
      return false;
    }
    return true;
  }

  const validatePasswordInput = () => {
    if (password.length === 0) {
      setPasswordError("You must enter a password.");
      return false;
    }
    return true;
  }

  const loginUser = async () => {
    let isValid = true;

    isValid = validateEmailInput() && isValid;
    isValid = validatePasswordInput() && isValid;

    if (!isValid) {
      return;
    }

    const res = await Login.getExistingUser(email, password, csrfToken);
    if (res.error) {
      setEmailError(res.error);
      setPasswordError(res.error);
    } else {
      updateUser(res.user);
      handleRedirect();
    }
  }

  return (
    <Form>
      <Input
        title={"Email"}
        hint={"Enter Email"}
        id={"formEmailInput"}
        val={email}
        setState={setEmail}
        err={emailError}
      />
      <Input
        title={"Password"}
        hint={"Enter Password"}
        id={"formPasswordInput"}
        val={password}
        setState={setPassword}
        err={passwordError}
      />
      <div className="btn_indicator_container">
        <ActionButton
          styling="form_postBtn"
          buttonText="Login"
          clickMethod={loginUser}
        />
        <div className="mandatory_indicator">
          * indicates mandatory fields
        </div>
      </div>
      <div className="login-btns">
        <ActionButton
          styling="bluebtn"
          buttonText="Click to Register!"
          clickMethod={handleRegister}
        />
      </div>
    </Form>
  );
};

Login.getExistingUser = getExistingUser;
Login.checkLoginStatus = checkLoginStatus;
Login.fetchCSRF = fetchCSRF;
export default Login;
