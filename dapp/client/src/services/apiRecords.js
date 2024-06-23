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
