import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/",
});

export const registerUser = async (userData) => {
  const response = await api.put("/auth/signup", userData);
  localStorage.setItem("session", JSON.stringify(response.data.session));
  return response.data.session.user;
};

export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  localStorage.setItem("session", JSON.stringify(response.data.session));
  return response.data.session.user;
};

export const getCurrentUser = async () => {
  const session = JSON.parse(localStorage.getItem("session"));
  if (!session || !session.access_token) return null;

  const now = Date.now();
  if (now > session.expires_at) {
    try {
      const response = await api.post("/auth/refresh-token", {
        refreshToken: session.refresh_token,
      });
      session.access_token = response.data.access_token;
      session.expires_at = response.data.expires_at;
      session.expires_in = response.data.expires_in;
      localStorage.setItem("session", JSON.stringify(session));
    } catch (err) {
      console.error(err);
      localStorage.removeItem("session");
      return null;
    }
  }

  try {
    const response = await api.get("/auth/user", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    return response.data.user;
  } catch (err) {
    console.error(err);
    return null;
  }
};
