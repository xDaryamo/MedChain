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

export const getPatient = async (id) => {
  // Controlla se l'id è nel formato "patient/{id}"
  const match = id.match(/^patient\/(.+)$/);
  const actualId = match ? match[1] : id;

  const response = await api.get(`/patient/${actualId}`);
  return response.data;
};

export const searchPatients = async (query) => {
  const response = await api.post("/patient/search", { query });
  return response.data.results || [];
};

export const createPatient = async (patient) => {
  const response = await api.post(`/patient`, patient);
  return response.data;
};

export const updatePatient = async (id, patient) => {
  const response = await api.patch(`/patient/${id}`, patient);
  return response.data;
};

export const deletePatient = async (id) => {
  const response = await api.delete(`/patient/${id}`);
  return response.data;
};

export const requestAccess = async (id, isOrg = false) => {
  const response = await api.post(`/patient/request-access/${id}`, isOrg);
  return response.data;
};

export const grantAccess = async (requesterId) => {
  const response = await api.post(`/patient/grant-access/${requesterId}`);
  return response.data;
};

export const revokeAccess = async (requesterId) => {
  const response = await api.post(`/patient/revoke-access/${requesterId}`);
  return response.data;
};

export const getAccessRequests = async () => {
  const response = await api.get(`/patient/access-requests/`);
  return response.data || [];
};

export const getPatientByEmail = async (email) => {
  const response = await api.post(`/patient/email/`, { email });
  return response.data;
};

export default api;
