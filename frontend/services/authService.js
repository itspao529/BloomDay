import API from "./api";

export const login = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};

export const register = async (nombre, email, password, rol) => {
  const res = await API.post("/auth/register", { nombre, email, password, rol });
  return res.data;
};
