import api from "../lib/api";

const ENDPOINT = "/ubicaciones";

export const getUbicaciones = async () => {
    const response = await api.get(ENDPOINT);
    return response.data;
};

export const createUbicacion = async (ubicacion) => {
    // ubicacion debe tener: { nombreEdificio, piso, pabellon, descripcion }
    const response = await api.post(ENDPOINT, ubicacion);
    return response.data;
};

export const updateUbicacion = async (id, ubicacion) => {
    const response = await api.put(`${ENDPOINT}/${id}`, ubicacion);
    return response.data;
};

export const deleteUbicacion = async (id) => {
    await api.delete(`${ENDPOINT}/${id}`);
};