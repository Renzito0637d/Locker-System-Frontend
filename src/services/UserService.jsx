import api from "../lib/api";

const ENDPOINT = "/users/";

export const getAllUsers = async () => {
    const res = await api.get(ENDPOINT);
    return res.data;
};

export const createUser = async (userData) => {
    // userData debe coincidir con CreateUserRequest de Java
    const res = await api.post(ENDPOINT, userData);
    return res.data;
};

export const updateUser = async (id, userData) => {
    const res = await api.put(`${ENDPOINT}${id}`, userData);
    return res.data;
};

export const deleteUser = async (id) => {
    await api.delete(`${ENDPOINT}${id}`);
};

// Opcional: Endpoint para desactivar
export const toggleUserActive = async (id) => {
    await api.patch(`${ENDPOINT}${id}/toggle-active`);
};