import axios from "axios";

const api = axios.create({
  baseURL: "https://fw9wxat7t9.execute-api.us-east-1.amazonaws.com/Prod/",
});

export default api;
