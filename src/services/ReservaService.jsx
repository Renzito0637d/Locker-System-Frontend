import api from "../lib/api";
import { getMe } from "../lib/auth";

// --- LOCKERS ---
export const getLockers = async () => {
    try {
        const res = await api.get("/lockers/"); // Ojo con el slash al final
        console.log("Respuesta RAW de lockers:", res.data); // <--- MIRA ESTO EN CONSOLA

        // Si Spring devuelve una lista directa
        if (Array.isArray(res.data)) {
            return res.data;
        }
        // Si Spring devuelve paginación o un objeto envoltorio
        if (res.data && Array.isArray(res.data.content)) {
            return res.data.content;
        }
        
        // Si no es nada de lo anterior, retornamos array vacío para evitar crash
        return [];
    } catch (error) {
        console.error("Error obteniendo lockers:", error);
        return []; // Retornar array vacío en caso de error
    }
};

// --- RESERVAS ---
// Nota: Idealmente el backend debería tener un endpoint /reservas/mis-reservas
// Aquí filtraremos en el frontend temporalmente si el backend devuelve TODAS.
export const getMisReservas = async () => {
    const user = await getMe();
    const res = await api.get("/reservas/");
    
    // Si tu backend devuelve TODAS las reservas, filtramos por el ID del usuario logueado
    // Si tu backend ya filtra, borra el .filter
    const todas = res.data;
    return todas.filter(r => r.user && r.user.id === user.id);
};

export const createReserva = async (reservaData) => {
    // reservaData espera: { fechaInicio, fechaFin, estadoReserva, userId, lockerId }
    const res = await api.post("/reservas/", reservaData);
    return res.data;
};

export const deleteReserva = async (id) => {
    await api.delete(`/reservas/${id}`);
};