import axios from "axios";

const api = axios.create({
  baseURL: "https://5gjblbbbz0.execute-api.us-west-2.amazonaws.com/Prod/",
});

export default api;
