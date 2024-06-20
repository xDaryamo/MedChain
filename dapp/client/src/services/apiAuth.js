import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/",
});

// Funzione per registrare un nuovo utente
export const registerUser = async (userData) => {
  const response = await api.put("/auth/signup", userData);
  return response.data;
};

// Funzione per il login di un utente
export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

// Funzione per aggiornare i dati dell'utente corrente
export const updateCurrentUser = async (userData) => {
  const token = localStorage.getItem("token"); // Assicurati che il token sia presente
  const response = await api.put("/auth/update", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token"); // Assicurati che il token sia presente
  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
