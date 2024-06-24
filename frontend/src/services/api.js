import axios from "axios";

const api = axios.create({
  baseURL: "https://a59nppmp66.execute-api.us-east-1.amazonaws.com/Prod",
});

export default api;
