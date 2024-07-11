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
  const response = await api.post("/records/procedures/search", { query });
  return response.data.results || [];
};

export const createProceduresBatch = async (procedures) => {
  const response = await api.post("/records/procedures/batch", procedures);
  return response.data;
};

export const updateProceduresBatch = async (procedures) => {
  const response = await api.patch("/records/procedures/batch", procedures);
  return response.data;
};

export const deleteProceduresBatch = async (procedureIDs) => {
  const response = await api.delete("/records/procedures/batch", {
    data: { ids: procedureIDs },
  });
  return response.data;
};

export const searchConditions = async (query) => {
  const response = await api.post("/records/conditions/search", { query });
  return response.data.results || [];
};

export const createConditionsBatch = async (conditions) => {
  const response = await api.post("/records/conditions/batch", conditions);
  return response.data;
};

export const updateConditionsBatch = async (conditions) => {
  const response = await api.patch("/records/conditions/batch", conditions);
  return response.data;
};

export const deleteConditionsBatch = async (conditionIDs) => {
  const response = await api.delete("/records/conditions/batch", {
    data: { ids: conditionIDs },
  });
  return response.data;
};

export const searchAllergies = async (query) => {
  const response = await api.post("/records/allergies/search", { query });
  return response.data.results || [];
};

export const createAllergiesBatch = async (allergies) => {
  const response = await api.post("/records/allergies/batch", allergies);
  return response.data;
};

export const updateAllergiesBatch = async (allergies) => {
  const response = await api.patch("/records/allergies/batch", allergies);
  return response.data;
};

export const deleteAllergiesBatch = async (allergyIDs) => {
  const response = await api.delete("/records/allergies/batch", {
    data: { ids: allergyIDs },
  });
  return response.data;
};
