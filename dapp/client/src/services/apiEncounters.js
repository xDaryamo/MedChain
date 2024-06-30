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

export const searchEncounters = async (query) => {
    const response = await api.post("/encounters/search", { query });
    return response.data.results || [];
};

export const getEncounter = async (id) => {
    const response = await api.get(`/encounters/${id}`);
    return response.data;
};

export const createEncounter = async (encounter) => {
    const response = await api.post("/encounters", encounter);
    return response.data;
};

export const updateEncounter = async (id, encounter) => {
    const response = await api.patch(`/encounters/${id}`, encounter);
    return response.data;
};

export const deleteEncounter = async (id) => {
    const response = await api.delete(`/encounters/${id}`);
    return response.data;
};
