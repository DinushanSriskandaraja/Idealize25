import axios from "axios";

const BASE_URL = "http://192.168.x.x:8000/api"; // your Django IP

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
