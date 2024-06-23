// src/api.js
import axios from "axios";
import { getToken } from "../utils/token";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getMedicalRecords = async () => {
  const response = await api.get("/records", {
    params: {
      query: JSON.stringify({ selector: {} }),
    },
  });
  return response.data;
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
  try {
    const response = await api.post("/procedures", procedure);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || error.message);
  }
};

export const readProcedure = async (id) => {
  try {
    const response = await api.get(`/procedures/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || error.message);
  }
};

export const updateProcedure = async (id, procedure) => {
  try {
    const response = await api.patch(`/procedures/${id}`, procedure);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || error.message);
  }
};

export const deleteProcedure = async (id) => {
  try {
    const response = await api.delete(`/procedures/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || error.message);
  }
};

export const createCondition = async (condition) => {
  try {
    const response = await api.post("/conditions", condition);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || error.message);
  }
};

export const readCondition = async (id) => {
  try {
    const response = await api.get(`/conditions/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || error.message);
  }
};

export const updateCondition = async (id, condition) => {
  try {
    const response = await api.patch(`/conditions/${id}`, condition);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || error.message);
  }
};

export const deleteCondition = async (id) => {
  try {
    const response = await api.delete(`/conditions/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || error.message);
  }
};
