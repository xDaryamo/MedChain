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

export const searchPrescriptions = async (query) => {
  const response = await api.post("/prescription/search", { query });
  return response.data.results || [];
};

export const getPrescription = async (id) => {
  const response = await api.get(`/prescription/${id}`);
  return response.data;
};

export const createPrescription = async (prescription) => {
  const response = await api.post("/prescription", prescription);
  return response.data;
};

export const updatePrescription = async (id, prescription) => {
  const response = await api.patch(`/prescription/${id}`, prescription);
  return response.data;
};

export const deletePrescription = async (id) => {
  const response = await api.delete(`/prescription/${id}`);
  return response.data;
};

export const createPrescriptionsBatch = async (prescriptions) => {
  const response = await api.post("/prescription/batch", { prescriptions });
  return response.data;
};

export const updatePrescriptionsBatch = async (prescriptions) => {
  const response = await api.patch("/prescription/batch", { prescriptions });
  return response.data;
};

export const deletePrescriptionsBatch = async (ids) => {
  const response = await api.delete("/prescription/batch", { data: { ids } });
  return response.data;
};
