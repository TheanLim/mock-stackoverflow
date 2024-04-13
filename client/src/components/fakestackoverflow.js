import React from "react";
import { useState } from "react";
import Header from "./header";
import Main from "./main";

export default function FakeStackOverflow() {
  const [search, setSearch] = useState("");
  const [mainTitle, setMainTitle] = useState("All Questions");
  const [appStatus, setAppStatus] = useState("logged_out");
  const [user, setUser] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');


  const setQuestionPage = (search = "", title = "All Questions") => {
    setSearch(search);
    setMainTitle(title);
  };

  const updateAppStatus = (status) => {
    setAppStatus(status);
  }

  const updateUser = (userLogIn) => {
    setUser(userLogIn)
  }

  return (
    <>
      <Header
        search={search}
        loggedIn={user}
        csrfToken={csrfToken}
        setQuestionPage={setQuestionPage}
        updateAppStatus={updateAppStatus}
        updateUser={updateUser}
        setCsrfToken={setCsrfToken}
      />
      <Main
        title={mainTitle}
        search={search}
        user={user}
        appStatus={appStatus}
        csrfToken={csrfToken}
        updateAppStatus={updateAppStatus}
        setQuestionPage={setQuestionPage}
        updateUser={updateUser}
        setCsrfToken={setCsrfToken}
      />
    </>
  );
}
