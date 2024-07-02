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

export const getPractitioner = async (id) => {
  const response = await api.get(`/practitioner/${id}`);
  return response.data;
};

export const createPractitioner = async (practitioner) => {
  const response = await api.post(`/practitioner`, practitioner);
  return response.data;
};

export const updatePractitioner = async (id, practitioner) => {
  const response = await api.patch(`/practitioner/${id}`, practitioner);
  return response.data;
};

export const deletePractitioner = async (id) => {
  const response = await api.delete(`/practitioner/${id}`);
  return response.data;
};

export const getFollowedPatients = async () => {
  const response = await api.get(`/practitioner/followed-patients`);
  return response.data;
};

export default api;
