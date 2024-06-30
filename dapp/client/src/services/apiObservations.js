import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/",
});

const getSession = () => {
    const session = JSON.parse(localStorage.getItem("session"));
    return session ? session.access_token : null;
};

// Add authorization token to each request if present
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

export const searchObservations = async (query) => {
    try {
        const response = await api.post("/observation/search", { query });
        return response.data.results || [];
    } catch (error) {
        console.error("Error searching observations:", error);
        throw error;
    }
};

export const getObservation = async (id) => {
    try {
        const response = await api.get(`/observation/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching observation ${id}:`, error);
        throw error;
    }
};

export const createObservation = async (observation) => {
    try {
        const response = await api.post("/observation", observation);
        return response.data;
    } catch (error) {
        console.error("Error creating observation:", error);
        throw error;
    }
};

export const updateObservation = async (id, observation) => {
    try {
        const response = await api.patch(`/observation/${id}`, observation);
        return response.data;
    } catch (error) {
        console.error(`Error updating observation ${id}:`, error);
        throw error;
    }
};

export const deleteObservation = async (id) => {
    try {
        const response = await api.delete(`/observation/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting observation ${id}:`, error);
        throw error;
    }
};
