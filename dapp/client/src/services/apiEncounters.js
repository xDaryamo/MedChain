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

export const searchEncounters = async (query) => {
  const response = await api.post("/encounters/search", query);
  console.log(response.data.results);
  return response.data.results || [];
};

export const getEncounter = async (id) => {
  const response = await api.get(`/encounters/${id}`);
  return response.data;
};

export const createEncounter = async (encounter) => {
  const response = await api.post("/encounters", encounter);
  return response.data;
};

export const updateEncounter = async (id, encounter) => {
  const response = await api.patch(`/encounters/${id}`, encounter);
  return response.data;
};

export const deleteEncounter = async (id) => {
  const response = await api.delete(`/encounters/${id}`);
  return response.data;
};
