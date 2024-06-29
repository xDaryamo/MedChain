import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/",
});

const getSession = () => {
  const session = JSON.parse(localStorage.getItem("session"));
  return session ? session.access_token : null;
};

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

export const getPatient = async (id) => {
  // Controlla se l'id è nel formato "patient/{id}"
  const match = id.match(/^patient\/(.+)$/);
  const actualId = match ? match[1] : id;
  console.log(actualId);

  const response = await api.get(`/patient/${actualId}`);
  console.log(response.data);
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

export const requestAccess = async (id) => {
  const response = await api.post(`/patient/request-access/${id}`);
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

export default api;
