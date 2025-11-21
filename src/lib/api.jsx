// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api", // ✅ solo aquí se define una vez
  withCredentials: true, // necesario para enviar y recibir cookies JWT
});

export default api;
