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

export const getMedicalRecords = async () => {
  const response = await api.post("/records/search");
  console.log(response.data);
  return response.data.results || [];
};

export const getMedicalRecord = async (id) => {
  const response = await api.get(`/records/${id}`);
  return response.data;
};

export const createMedicalRecord = async (record) => {
  const response = await api.post("/records", record);
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
