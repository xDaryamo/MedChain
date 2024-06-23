export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  const expireDate = localStorage.getItem("expireDate");

  if (!token || !expireDate) {
    return false;
  }

  const now = new Date();
  const expirationDate = new Date(expireDate);

  if (now >= expirationDate) {
    // Token is expired, remove it from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("expireDate");
    return false;
  }

  return true;
};
