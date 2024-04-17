import { REACT_APP_API_URL, api } from "./config";

const PROFILE_API_URL = `${REACT_APP_API_URL}/profile`;

const viewUserProfile = async (uid) => {
  const res = await api.get(`${PROFILE_API_URL}/view/${uid}`);

  return res.data || res.response.data;
}

const updateProfile = async (user) => {
  const res = await api.post(`${PROFILE_API_URL}/edit`, user);

  return res.data || res.response.data;
}

export { viewUserProfile, updateProfile };