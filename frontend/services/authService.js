import API from "./api";

export const login = async (email, password) => {
  const response = await API.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (nombre, email, password, rol) => {
  const response = await API.post("/auth/register", { nombre, email, password, rol });
  return response.data;
};
