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

export const searchMedicationRequests = async (query) => {
    const response = await api.post("/prescription/search", { query });
    return response.data.results || [];
};

export const getMedicationRequest = async (id) => {
    const response = await api.get(`/prescription/${id}`);
    return response.data;
};

export const createMedicationRequest = async (medicationRequest) => {
    const response = await api.post("/prescription", medicationRequest);
    return response.data;
};

export const updateMedicationRequest = async (id, medicationRequest) => {
    const response = await api.patch(`/prescription/${id}`, medicationRequest);
    return response.data;
};

export const deleteMedicationRequest = async (id) => {
    const response = await api.delete(`/prescription/${id}`);
    return response.data;
};
