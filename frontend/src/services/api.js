import axios from "axios";

const api = axios.create({
  baseURL: "https://dszpj90mbb.execute-api.us-east-1.amazonaws.com/Prod/",
});

export default api;
