import API from "./api";

export const getEvents = async () => {

  const response = await API.get(
    "/eventos"
  );

  return response.data;
};
