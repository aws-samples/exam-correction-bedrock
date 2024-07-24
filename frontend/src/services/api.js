import axios from "axios";

const api = axios.create({
  baseURL: "API_GATEWAY_URL",
});

export default api;
