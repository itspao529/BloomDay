import API from "./api";

export const getEvents = async () => {
  const res = await API.get("/eventos");
  return res.data;
};

export const createEvent = async (titulo, descripcion, fecha, lugar) => {
  const res = await API.post("/eventos", { titulo, descripcion, fecha, lugar });
  return res.data;
};

export const updateEvent = async (id, titulo, descripcion, fecha, lugar) => {
  const res = await API.put(`/eventos/${id}`, { titulo, descripcion, fecha, lugar });
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await API.delete(`/eventos/${id}`);
  return res.data;
};
