import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/",
});

const getSession = () => {
  const session = JSON.parse(localStorage.getItem("session"));
  return session ? session.access_token : null;
};

// Aggiunge il token di autorizzazione a ogni richiesta se è presente
api.interceptors.request.use(
  (config) => {
    const token = getSession();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const getLabResult = async (id) => {
  const response = await api.get(`/labresults/${id}`);
  return response.data;
};

export const searchLabResults = async (query) => {
  const response = await api.post(`/labresults/search`, { query });
  return response.data.results || [];
};

export const createLabResult = async (labResult) => {
  const response = await api.post(`/labresults`, labResult);
  return response.data;
};

export const updateLabResult = async (id, labResult) => {
  const response = await api.patch(`/labresults/${id}`, labResult);
  return response.data;
};

export const deleteLabResult = async (id) => {
  const response = await api.delete(`/labresults/${id}`);
  return response.data;
};

export default api;
