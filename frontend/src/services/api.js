import axios from "axios";

const api = axios.create({
  baseURL: "https://rgim2ffohk.execute-api.us-west-2.amazonaws.com/Prod/",
});

export default api;
