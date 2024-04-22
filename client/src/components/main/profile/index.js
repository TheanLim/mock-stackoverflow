import {useEffect, useState} from "react";
import "./index.css";

import {viewUserProfile} from "../../../services/profileService";
import {getMetaData, handleHyperlink} from "../../../tool";
import ActionButton from "../baseComponents/button";

const Profile = ({profileUser, handleAnswer, handleEditProfile}) => {
  const [profileInfo, setProfileInfo] = useState({});
  const [ownership, setOwnership] = useState(false);
  const [userQList, setUserQList] = useState([]);
  const [userAnsList, setUserAnsList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      let res = await Profile.viewUserProfile(profileUser);
      setProfileInfo(res.profile || {});
      setOwnership(res.profileOwner || false);
      setUserQList(res.questions || []);
      setUserAnsList(res.answers);
    };

    fetchData().catch((e) => console.log(e));
  }, [profileUser]);

  const renderQuestionList = (list, type) => {
    return (
      <div className="questions-list">
        <h2>{`${type === 'q' ? 'Asked' : 'Answered'} Questions`}</h2>
        {list.map((q, idx) => (
          <div key={`question-${idx}`}
               className="question right_padding"
               onClick={() => {
                 handleAnswer(q._id);
               }}>
            <div className="postTitle">{q.title}</div>
            <div className="question_meta">
              {type === 'q' ?
                `asked ${Profile.getMetaData(new Date(q.ask_date_time))}` :
                `answered ${Profile.getMetaData(new Date(q.answers[0].ans_date_time))}`
              }
            </div>
          </div>
        ))}
      </div>
    );
  }

  const renderInfoLine = (text, value) => (
    <div className="info-line"><strong>{`${text} `}</strong> {value}</div>
  )

  return (
    <div className="profile-container">
      <div className="details-container">
        {renderInfoLine("Display Name:", profileInfo.display_name)}
        <div className="dates">
          {renderInfoLine("Joined:", Profile.getMetaData(new Date(profileInfo.date_joined)))}
          {renderInfoLine("Last seen:", Profile.getMetaData(new Date(profileInfo.time_last_seen)))}
        </div>
        {ownership &&
          <div className="personal-info">
            {renderInfoLine("Email:", profileInfo.email)}
            {renderInfoLine("Name:", `${profileInfo.first_name} ${profileInfo.last_name}`)}
          </div>
        }
      </div>
      {profileInfo.about_summary &&
        <div className="about-summary">
          <div><strong>About</strong></div>
          {Profile.handleHyperlink(profileInfo.about_summary)}
        </div>
      }
      {ownership &&
        <div className="btn-container">
          <ActionButton
            styling="bluebtn"
            buttonText="Edit Profile"
            clickMethod={handleEditProfile}
          />
        </div>
      }

      <div className="profile-stats">
        {renderInfoLine(profileInfo.reputation, "reputation earned")}
        {renderInfoLine(userQList.length, "questions asked")}
        {renderInfoLine(userAnsList.length, "questions answered")}
      </div>
      {renderQuestionList(userQList, "q")}
      {renderQuestionList(userAnsList, "a")}
    </div>
  );
}

Profile.viewUserProfile = viewUserProfile;
Profile.getMetaData = getMetaData;
Profile.handleHyperlink = handleHyperlink;
export default Profile;