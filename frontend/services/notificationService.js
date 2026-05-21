import API from "./api";

export const getNotifications = async () => {

  const response = await API.get(
    "/notificaciones"
  );

  return response.data;
};
