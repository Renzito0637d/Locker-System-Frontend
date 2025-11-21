import api from "../lib/api";
import { getMe } from "../lib/auth";

const ENDPOINT = "/reportes";

// Obtener solo los reportes creados por el usuario actual
export const getMisReportes = async () => {
    try {
        const user = await getMe();
        const res = await api.get(ENDPOINT);
        const todos = Array.isArray(res.data) ? res.data : [];

        // Filtramos por el ID del usuario logueado
        return todos.filter(r => r.user && r.user.id === user.id);
    } catch (error) {
        console.error("Error obteniendo mis reportes:", error);
        return [];
    }
};

// Crear un nuevo reporte de incidencia
export const createReporte = async (reporteData) => {
    // reporteData debe coincidir con el DTO del backend:
    // { descripcion, tipoReporte, userId, lockerId }
    const res = await api.post(ENDPOINT, reporteData);
    return res.data;
};

// --- MÉTODOS PARA ADMIN ---

// Obtener TODOS los reportes registrados en el sistema
export const getAllReportes = async () => {
    try {
        const res = await api.get(ENDPOINT);
        // Validación defensiva para asegurar que siempre retornamos un array
        return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
        console.error("Error obteniendo todos los reportes:", error);
        return [];
    }
};

// Actualizar un reporte (usado por Admin para llenar accionesTomadas y cambiar estado)
export const updateReporte = async (id, reporteData) => {
    // reporteData espera: { descripcion, tipoReporte, accionesTomadas, estado }
    const res = await api.put(`${ENDPOINT}/${id}`, reporteData);
    return res.data;
};

// --- MÉTODOS COMUNES ---

// Eliminar un reporte por ID
export const deleteReporte = async (id) => {
    await api.delete(`${ENDPOINT}/${id}`);
};