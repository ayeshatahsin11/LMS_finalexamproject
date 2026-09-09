import axios from "axios";

const serverURL = import.meta.env.VITE_SERVER_URL;

const api = axios.create({
  baseURL: `${serverURL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;