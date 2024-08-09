import axios from "axios";

const api = axios.create({
  baseURL: "https://8cct71h26d.execute-api.us-west-2.amazonaws.com/Prod/",
});

export default api;
