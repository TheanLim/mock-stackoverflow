import {useEffect, useState} from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import Textarea from "../baseComponents/textarea";
import "./index.css";

import { viewUserProfile, updateProfile } from "../../../services/profileService";
import ActionButton from "../baseComponents/button";

const EditProfile = ({ profileUser, handleProfile }) => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");

  const [displayNameErr, setDisplayNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [aboutErr, setAboutErr] = useState("");
  const [fNameErr, setFNameErr] = useState("");
  const [lNameErr, setLNameErr] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let res = await EditProfile.viewUserProfile(profileUser);
      setDisplayName(res.profile.display_name || "");
      setEmail(res.profile.email || "");
      setAbout(res.profile.about_summary || "");
      setFName(res.profile.first_name || "");
      setLName(res.profile.last_name || "");
    };

    fetchData().catch((e) => console.log(e));
  }, [profileUser]);

  const validateNotEmpty = (input, field, setErrorMethod) => {
    if (input.length === 0) {
      setErrorMethod(`Your ${field} is required.`);
      return false;
    }
    return true;
  }

  const validateEmailInput = () => {
    const emailValidationRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!validateNotEmpty(email, "email", setEmailErr)) {
      return false;
    } else if (!emailValidationRegex.test(email)) {
      setEmailErr("Invalid Email Format.");
      return false;
    }
    return true;
  }

  const clearErrors = () => {
    setEmailErr("");
    setDisplayNameErr("");
    setFNameErr("");
    setAboutErr("");
    setLNameErr("");
  }

  const editProfile = async () => {
    clearErrors();
    let isValid = true;
    isValid = validateEmailInput() && isValid;
    isValid = validateNotEmpty(displayName, "display name", setDisplayNameErr) && isValid;
    isValid = validateNotEmpty(fName, "first name", setFNameErr) && isValid;
    isValid = validateNotEmpty(lName, "last name", setLNameErr) && isValid;

    if (about.length > 230) {
      setAboutErr("Limit about section to 230 words or less.")
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const user = {
      email: email,
      display_name: displayName,
      about_summary: about,
      first_name: fName,
      last_name: lName
    }

    const res = await EditProfile.updateProfile(user);

    if (res.error === 'New Display Name already exists') {
      setDisplayNameErr(res.error);
    } else if (res.error === 'New email already exists') {
      setEmailErr(res.error);
    } else {
      handleProfile(res.user);
    }
  }


  return (
    <Form>
      <Input
        title={"Display Name"}
        hint={"Edit your username/display name"}
        id={"formDisplayNameInput"}
        val={displayName}
        setState={setDisplayName}
        err={displayNameErr}
      />
      <Input
        title={"Email"}
        hint={"Edit your email"}
        id={"formEmailInput"}
        val={email}
        setState={setEmail}
        err={emailErr}
      />
      <Textarea
        title={"About Summary"}
        hint={"Edit your personal summary"}
        id={"formAboutText"}
        val={about}
        setState={setAbout}
        err={aboutErr}
      />
      <Input
        title={"First Name"}
        hint={"Edit your first name"}
        id={"formFNameInput"}
        val={fName}
        setState={setFName}
        err={fNameErr}
      />
      <Input
        title={"Last Name"}
        hint={"Edit your last name"}
        id={"formLNameInput"}
        val={lName}
        setState={setLName}
        err={lNameErr}
      />
      <div className="btn_indicator_container">
        <ActionButton
          styling="form_postBtn"
          buttonText="Update Profile"
          clickMethod={editProfile}
        />
      </div>
    </Form>
  );
};

EditProfile.updateProfile = updateProfile;
EditProfile.viewUserProfile = viewUserProfile;
export default EditProfile;
