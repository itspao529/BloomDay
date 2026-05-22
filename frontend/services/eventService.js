import API from "./api";

export const getEvents = async () => {
  const response = await API.get("/eventos");
  return response.data;
};

export const createEvent = async (titulo, descripcion, fecha, lugar) => {
  const response = await API.post("/eventos", { titulo, descripcion, fecha, lugar });
  return response.data;
};

export const updateEvent = async (id, titulo, descripcion, fecha, lugar) => {
  const response = await API.put(`/eventos/${id}`, { titulo, descripcion, fecha, lugar });
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await API.delete(`/eventos/${id}`);
  return response.data;
};