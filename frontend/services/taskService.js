import API from "./api";

export const getTasks = async () => {
  const response = await API.get("/tareas");
  return response.data;
};

export const createTask = async (titulo, descripcion = "", prioridad = "media") => {
  const response = await API.post("/tareas", { titulo, descripcion, estado: "pendiente", prioridad });
  return response.data;
};

export const updateTask = async (id, data) => {
  const response = await API.put(`/tareas/${id}`, data);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await API.delete(`/tareas/${id}`);
  return response.data;
};