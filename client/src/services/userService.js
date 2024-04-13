import { REACT_APP_API_URL, api } from "./config";

const USER_API_URL = `${REACT_APP_API_URL}/user`;

// To Login an Existing User
const getExistingUser = async (email, password, csrfToken) => {
  const req = {
    email: email,
    password: password
  }
  const res = await api.post(
    `${USER_API_URL}/login`, req, {
      headers: {
        'X-CSRF-Token': csrfToken,
      },
      withCredentials: true,
    }
  );

  return res.data || res.response.data;
};

//To create a new user
const registerNewUser = async (req, csrfToken) => {
  const res = await api.post(
    `${USER_API_URL}/signUp`, req, {
    headers: {
      'X-CSRF-Token': csrfToken,
    },
    withCredentials: true,
  }
  );

  return res.data;
};

//Check if user is currently logged in, returning ID
const checkLoginStatus = async (csrfToken) => {
  const res = await api.get(`${USER_API_URL}/validateAuth`, {
    headers: {
      'X-CSRF-Token': csrfToken,
    },
    withCredentials: true,
  });
  return res.data;
}

const logOutUser = async (csrfToken) => {
  const res = await api.get(`${USER_API_URL}/logout`, {
    headers: {
      'X-CSRF-Token': csrfToken,
    },
    withCredentials: true,
  });
  return res.data;
}

const fetchCSRF = async () => {
  try {
    const response = await api.get(`${USER_API_URL}/csrf-token`);
    return response.data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
}

export { getExistingUser, registerNewUser, checkLoginStatus, logOutUser, fetchCSRF };