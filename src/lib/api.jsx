// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://locker-system-backendv2.onrender.com", // ✅ solo aquí se define una vez
  withCredentials: true, // necesario para enviar y recibir cookies JWT
});

export default api;
