import "./index.css";
import { useState } from "react";
import SideBarNav from "./sideBarNav";
import QuestionPage from "./questionPage";
import TagPage from "./tagPage";
import AnswerPage from "./answerPage";
import NewQuestion from "./newQuestion";
import NewAnswer from "./newAnswer";
import Login from "./login";
import Register from './register';

import {checkLoginStatus} from "../../services/userService";

const Main = ({
                search = "",
                title,
                user,
                appStatus,
                csrfToken,
                setQuestionPage,
                updateAppStatus,
                updateUser,
                setCsrfToken
              }) => {
  const [page, setPage] = useState("home");
  const [questionOrder, setQuestionOrder] = useState("newest");
  const [qid, setQid] = useState("");
  const [redirect, setRedirect] = useState("home");
  let selected = "";
  let content = null;

  const handleQuestions = () => {
    setQuestionPage();
    setRedirect("home");
    setPage("home");
  };

  const handleTags = () => {
    setRedirect("tag");
    setPage("tag");
  };

  const handleAnswer = (qid) => {
    setQid(qid);
    setRedirect("answer");
    setPage("answer");
  };

  const clickTag = (tname) => {
    setQuestionPage("[" + tname + "]", tname);
    setRedirect("home");
    setPage("home");
  };

  const handleNewQuestion = () => {
    setRedirect("newQuestion");
    setPage("newQuestion");
  };

  const handleNewAnswer = () => {
    setRedirect("newAnswer");
    setPage("newAnswer");
  };

  const handleLogin = () => {
    setPage("login");
  }

  const handleRegister = () => {
    setPage("register");
  }

  const handleRedirect = () => {
    setPage(redirect);
    updateAppStatus("logged_in");
  }

  const getQuestionPage = (order = "newest", search = "") => {
    return (
      <QuestionPage
        title_text={title}
        order={order}
        search={search}
        setQuestionOrder={setQuestionOrder}
        clickTag={clickTag}
        handleAnswer={handleAnswer}
        handleNewQuestion={handleNewQuestion}
      />
    );
  };

  switch (appStatus) {
    case "started_login": {
      if (page !== "login") {
        setPage("login");
      }
      updateAppStatus("logged_out");
      break;
    }
    case "viewing_self_profile": {
      if (page !== "profile") {
        setPage("profile");
      }
      updateAppStatus("logged_in");
      break;
    }
    default: {
      break;
    }
  }

  switch (page) {
    case "home": {
      selected = "q";
      content = getQuestionPage(questionOrder.toLowerCase(), search);
      break;
    }
    case "tag": {
      selected = "t";
      content = (
        <TagPage
          clickTag={clickTag}
          handleNewQuestion={handleNewQuestion}
        />
      );
      break;
    }
    case "answer": {
      selected = "";
      content = (
        <AnswerPage
          qid={qid}
          handleNewQuestion={handleNewQuestion}
          handleNewAnswer={handleNewAnswer}
          user={user}
          handleLogin={handleLogin}
        />
      );
      break;
    }
    case "newQuestion": {
      if (user) {
        selected = "";
        content = <NewQuestion handleQuestions={handleQuestions}/>;
      } else {
        handleLogin();
      }
      break;
    }
    case "newAnswer": {
      if (user) {
        selected = "";
        content = <NewAnswer qid={qid} handleAnswer={handleAnswer}/>;
      } else {
        handleLogin();
      }
      break;
    }
    case "login": {
      selected = "";
      content = (
        <Login
          handleRedirect={handleRedirect}
          handleRegister={handleRegister}
          updateUser={updateUser}
          csrfToken={csrfToken}
          setCsrfToken={setCsrfToken}
        />
      );
      break;
    }
    case "register": {
      selected = "";
      content = (
        <Register
          handleRedirect={handleRedirect}
          handleLogin={handleLogin}
          updateUser={updateUser}
          csrfToken={csrfToken}
          setCsrfToken={setCsrfToken}
        />
      );
      break;
    }
    default:
      selected = "q";
      content = getQuestionPage();
      break;
  }

  return (
    <div id="main" className="main">
      <SideBarNav
        selected={selected}
        handleQuestions={handleQuestions}
        handleTags={handleTags}
      />
      <div id="right_main" className="right_main">
        {content}
      </div>
    </div>
  );
};

Main.checkLoginStatus = checkLoginStatus;
export default Main;
