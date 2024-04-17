import {useCallback, useEffect, useState} from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import "./index.css";

import { registerNewUser, fetchCSRF, checkLoginStatus } from "../../../services/userService";

const Register = ({ handleRedirect, handleLogin, updateUser, csrfToken, setCsrfToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [firstError, setFirstError] = useState("");
  const [lastError, setLastError] = useState("");

  const fetchCsrfToken = useCallback(async () => {
    const response = await Register.fetchCSRF();
    setCsrfToken(response);
  }, []);

  const checkRegister = useCallback(async () => {
    try {
      const response = await Register.checkLoginStatus(csrfToken);
      updateUser(response.user);
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  }, [csrfToken]);

  useEffect(() => {
    const fetchCsrfAndCheckLoginStatus = async () => {
      await fetchCsrfToken();
      await checkRegister();
    };
    // Call the function only when the component mounts
    if (!csrfToken) {
      fetchCsrfAndCheckLoginStatus();
    }
  }, [csrfToken, fetchCsrfToken, checkRegister]);

  const validateNotEmpty = (input, field, setErrorMethod) => {
    if (input.length === 0) {
      setErrorMethod(`Your ${field} is required.`);
      return false;
    }
    return true;
  }

  const validateEmailInput = () => {
    const emailValidationRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!validateNotEmpty(email, "email", setEmailError)) {
      return false;
    } else if (!emailValidationRegex.test(email)) {
      setEmailError("Invalid Email Format.");
      return false;
    }
    return true;
  }

  const registerUser = async () => {
    let isValid = true;
    isValid = validateEmailInput() && isValid;
    isValid = validateNotEmpty(password, "password", setPasswordError) && isValid;
    isValid = validateNotEmpty(username, "display name", setUsernameError) && isValid;
    isValid = validateNotEmpty(first, "first name", setFirstError) && isValid;
    isValid = validateNotEmpty(last, "last name", setLastError) && isValid;

    if (!isValid) {
      return;
    }

    const user = {
      email: email,
      password: password,
      display_name: username,
      first_name: first,
      last_name: last
    }

    const res = await Register.registerNewUser(user, csrfToken);

    if (res.error === 'Email already exists') {
      setEmailError(res.error);
    } else if (res.error === 'Display Name already exists') {
      setUsernameError(res.error);
    }else {
      updateUser(res)
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
      <Input
        title={"Display Name"}
        hint={"Enter Username"}
        id={"formUsernameInput"}
        val={username}
        setState={setUsername}
        err={usernameError}
      />
      <Input
        title={"First Name"}
        hint={"Enter Your First Name"}
        id={"formFirstNameInput"}
        val={first}
        setState={setFirst}
        err={firstError}
      />
      <Input
        title={"Last Name"}
        hint={"Enter Your Last Name"}
        id={"formLastNameInput"}
        val={last}
        setState={setLast}
        err={lastError}
      />
      <div className="btn_indicator_container">
        <button
          className="form_postBtn"
          onClick={() => {
            registerUser();
          }}
        >
          Register
        </button>
        <div className="mandatory_indicator">
          * indicates mandatory fields
        </div>
      </div>
      <div className="register-btns">
        <button
          className="bluebtn"
          onClick={() => {
            handleLogin();
          }}
        >
          Have an account? Login.
        </button>
      </div>
    </Form>
  );
};

Register.registerNewUser = registerNewUser;
Register.fetchCSRF = fetchCSRF;
Register.checkLoginStatus = checkLoginStatus;
export default Register;
