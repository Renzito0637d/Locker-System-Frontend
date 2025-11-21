// src/lib/reporteApi.js

import api from "./api"; // Importa la instancia base de Axios configurada

const REPORTE_URL = "/api/reportes"; 

/**
 * Función que llama al endpoint: GET /api/reportes/responses
 * Retorna la lista de ReporteResponse DTOs (Usado en vista Admin).
 */
export const getAllMappedReports = async () => {
    try {
        const response = await api.get(`${REPORTE_URL}/responses`);
        return response.data; 
    } catch (error) {
        console.error("Error al obtener el listado mapeado de reportes:", error);
        throw new Error("No se pudo conectar con el servicio de reportes.");
    }
};

/**
 * Función para actualizar el estado del reporte (RF17 - Usado en Admin)
 */
export const updateReporteStatus = async (id, nuevoEstado) => {
    try {
        const response = await api.patch(
            `${REPORTE_URL}/${id}/estado`,
            null, 
            {
                params: {
                    nuevoEstado: nuevoEstado 
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al actualizar estado del reporte:", error);
        throw new Error("Fallo al actualizar el estado del reporte en el servidor.");
    }
};

/**
 * Función para eliminar el reporte (Usado en Admin)
 */
export const deleteReporte = async (id) => {
    try {
        await api.delete(`${REPORTE_URL}/${id}`);
    } catch (error) {
        console.error("Error al eliminar el reporte:", error);
        throw new Error("Fallo al eliminar el reporte en el servidor.");
    }
};

/**
 * Función que llama al endpoint: POST /api/reportes (RF15 - Creación)
 */
export const createReporte = async (createRequest) => {
    try {
        const response = await api.post(`${REPORTE_URL}`, createRequest);
        return response.data; 
    } catch (error) {
        console.error("Error al crear el reporte:", error.response?.data || error.message);
        throw new Error("No se pudo enviar el reporte. Verifique los datos ingresados o si su sesión es válida.");
    }
};