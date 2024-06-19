// src/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const signup = async (userData) => {
  try {
    const response = await axios.put(`${API_URL}/auth/signup`, userData);
    return response.data;
  } catch (error) {
    console.error("Signup error:", error); // Aggiungi questo log
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Registration failed");
    } else {
      throw new Error("Network error");
    }
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error); // Aggiungi questo log
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Login failed");
    } else {
      throw new Error("Network error");
    }
  }
};

export const getMedicalRecords = async () => {
  const response = await axios.get(`${API_URL}/records`, {
    params: {
      query: JSON.stringify({ selector: {} })
    }
  });
  return response.data;
};

export const getMedicalRecord = async (id) => {
  const response = await axios.get(`${API_URL}/records/${id}`);
  return response.data;
};

export const createMedicalRecord = async (record) => {
  const response = await axios.post(`${API_URL}/records`, record);
  return response.data;
};

export const updateMedicalRecord = async (id, record) => {
  const response = await axios.patch(`${API_URL}/records/${id}`, record);
  return response.data;
};

export const deleteMedicalRecord = async (id) => {
  const response = await axios.delete(`${API_URL}/records/${id}`);
  return response.data;
};
