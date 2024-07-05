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

export const searchMedicalRecords = async (query) => {
  const response = await api.post("/records/search", query);
  return response.data.results || [];
};

export const getMedicalRecord = async (id) => {
  const response = await api.get(`/records/${id}`);
  return response.data.record;
};

export const createMedicalRecord = async (record) => {
  const response = await api.post("/records", record);
  console.log(record);
  return response.data;
};

export const updateMedicalRecord = async (id, record) => {
  const response = await api.patch(`/records/${id}`, record);
  return response.data;
};

export const deleteMedicalRecord = async (id) => {
  const response = await api.delete(`/records/${id}`);
  return response.data;
};

export const searchProcedures = async (query) => {
  const response = await api.post("/procedures/search", { query });
  return response.data.results || [];
};

export const createProcedure = async (procedure) => {
  const response = await api.post("/procedures", procedure);
  return response.data;
};

export const readProcedure = async (id) => {
  const response = await api.get(`/procedures/${id}`);
  return response.data;
};

export const updateProcedure = async (id, procedure) => {
  const response = await api.patch(`/procedures/${id}`, procedure);
  return response.data;
};

export const deleteProcedure = async (id) => {
  const response = await api.delete(`/procedures/${id}`);
  return response.data;
};

export const searchConditions = async (query) => {
  const response = await api.post("/conditions/search", { query });
  return response.data.results || [];
};

export const createCondition = async (condition) => {
  const response = await api.post("/conditions", condition);
  return response.data;
};

export const readCondition = async (id) => {
  const response = await api.get(`/conditions/${id}`);
  return response.data;
};

export const updateCondition = async (id, condition) => {
  const response = await api.patch(`/conditions/${id}`, condition);
  return response.data;
};

export const deleteCondition = async (id) => {
  const response = await api.delete(`/conditions/${id}`);
  return response.data;
};

export const searchAllergies = async (query) => {
  const response = await api.post("/allergies/search", { query });
  return response.data.results || [];
};

export const createAllergy = async (condition) => {
  const response = await api.post("/allergies", condition);
  return response.data;
};

export const readAllergy = async (id) => {
  const response = await api.get(`/allergies/${id}`);
  return response.data;
};

export const updateAllergy = async (id, condition) => {
  const response = await api.patch(`/allergies/${id}`, condition);
  return response.data;
};

export const deleteAllergy = async (id) => {
  const response = await api.delete(`/allergies/${id}`);
  return response.data;
};
