// src/utils/token.js
export const getToken = () => {
    const token = localStorage.getItem("token");
    const expireDate = localStorage.getItem("expireDate");
    if (!token || !expireDate) return null;

    if (new Date() > new Date(expireDate)) {
        localStorage.removeItem("token");
        localStorage.removeItem("expireDate");
        return null;
    }

    return token;
};
