import axios from "axios";

const API = axios.create({

  baseURL: "http://192.168.0.11:8080/api",

  headers: {
    "Content-Type": "application/json",
  },

});

export default API;
