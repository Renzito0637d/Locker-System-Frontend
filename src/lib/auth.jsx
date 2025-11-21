import api from "./api";

export const login = async (userName, password) => {
  return await api.post("/auth/login", { userName, password });
};

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const logout = async () => {
  return await api.post("/auth/logout");
};

export const registerEstudiante = async (userData) => {
  return await api.post("/auth/registerEstudiante", userData);
};