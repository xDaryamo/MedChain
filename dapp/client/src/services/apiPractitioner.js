import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/",
});

const getSession = () => {
  const session = JSON.parse(localStorage.getItem("session"));
  return session ? session.access_token : null;
};

const refreshAccessToken = async () => {
  const session = JSON.parse(localStorage.getItem("session"));
  if (session && session.refresh_token) {
    try {
      const response = await api.post("/auth/refresh-token", {
        refreshToken: session.refresh_token,
      });
      const newSession = {
        ...session,
        access_token: response.data.access_token,
      };
      localStorage.setItem("session", JSON.stringify(newSession));
      return newSession.access_token;
    } catch (error) {
      localStorage.removeItem("session");
      window.location.href = "/login"; // Redirect to login page
    }
  }
  return null;
};

// Aggiunge il token di autorizzazione a ogni richiesta se è presente
api.interceptors.request.use(
  async (config) => {
    let token = getSession();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === "Token expired."
    ) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axios.request(error.config);
      }
    }
    return Promise.reject(error);
  },
);

export const getPractitioner = async (id) => {
  const response = await api.get(`/practitioner/${id}`);
  return response.data;
};

export const createPractitioner = async (practitioner) => {
  const response = await api.post(`/practitioner`, practitioner);
  return response.data;
};

export const updatePractitioner = async (id, practitioner) => {
  console.log(practitioner);
  const response = await api.patch(`/practitioner/${id}`, practitioner);
  return response.data;
};

export const deletePractitioner = async (id) => {
  const response = await api.delete(`/practitioner/${id}`);
  return response.data;
};

export const getFollowedPatients = async () => {
  const response = await api.get(`/practitioner/followed-patients`);

  return response.data || [];
};

export default api;
