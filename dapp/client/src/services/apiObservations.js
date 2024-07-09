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

export const searchObservations = async (query) => {
  try {
    console.log("Sending query: ", JSON.stringify(query, null, 2));
    const response = await api.post("/observation/search", query);
    console.log("Response: ", response.data);
    return response.data.results || [];
  } catch (error) {
    console.error("Error searching observations:", error);
    throw error;
  }
};

export const getObservation = async (id) => {
  try {
    console.log("id getObservation:", id);
    const response = await api.get(`/observation/${id}`);

    console.log("trovataaaaa:", response.data.observation);
    return response.data.observation;
  } catch (error) {
    console.error(`Error fetching observation ${id}:`, error);
    throw error;
  }
};

export const createObservation = async (observation) => {
  try {
    const response = await api.post("/observation", observation);
    return response.data;
  } catch (error) {
    console.error("Error creating observation:", error);
    throw error;
  }
};

export const updateObservation = async (id, observation) => {
  try {
    const response = await api.patch(`/observation/${id}`, observation);
    return response.data;
  } catch (error) {
    console.error(`Error updating observation ${id}:`, error);
    throw error;
  }
};

export const deleteObservation = async (id) => {
  try {
    const response = await api.delete(`/observation/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting observation ${id}:`, error);
    throw error;
  }
};
