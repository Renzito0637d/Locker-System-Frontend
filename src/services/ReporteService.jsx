import api from "../lib/api"; 

const ENDPOINT = "/reportes"; 


/**
 * Endpoint: POST /api/reportes
    @param {Object} createRequest -{ userId, lockerId, descripcion, tipoReporte }.
    @returns {Promise<Object>}
 */
export const createReporte = async (createRequest) => {
    try {
        const response = await api.post(ENDPOINT, createRequest);
        return response.data; 
    } catch (error) {
        console.error("Error al crear el reporte:", error.response?.data || error.message);
        throw new Error("No se pudo enviar el reporte. Verifique los datos o el estado de su sesión.");
    }
};

// ----------------------------------------------------
// RF15 / RF17: LISTADO Y ACCIONES CRUD (VISTA ADMIN)
// ----------------------------------------------------

/**
 * Obtiene la lista completa de ReporteResponse DTOs para la vista Admin.
 * Endpoint: GET /api/reportes/responses
 * @returns {Promise<ReporteResponse[]>}
 */
export const getReportesResponses = async () => {
    try {
        const response = await api.get(`${ENDPOINT}/responses`);
        return response.data; 
    } catch (error) {
        console.error("Error al obtener el listado de reportes:", error);
        throw new Error("Fallo al conectar con el servicio de listado de reportes.");
    }
};

/**
 * Elimina un reporte por ID.
 * Endpoint: DELETE /api/reportes/{id}
 */
export const deleteReporte = async (id) => {
    try {
        await api.delete(`${ENDPOINT}/${id}`);
    } catch (error) {
        console.error("Error al eliminar el reporte:", error);
        throw new Error("Fallo al eliminar el reporte en el servidor.");
    }
};

// ----------------------------------------------------
// RF16: GENERAR INFORME CON FILTROS (VISTA ADMIN)
// ----------------------------------------------------

/**
 * Genera un informe aplicando filtros.
 * Endpoint: GET /api/reportes/informe?estado=...&userId=...
 * @param {Object} filters - Objeto con filtros opcionales (estado, lockerId, userId, fechaInicio, fechaFin).
 * @returns {Promise<ReporteResponse[]>}
 */
export const generarInforme = async (filters) => {
    try {
        const params = new URLSearchParams();
        
        // Adjuntar filtros solo si tienen valor
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                 params.append(key, filters[key]);
            }
        });

        // La URL final será: /api/reportes/informe?estado=PENDIENTE&lockerId=1
        const response = await api.get(`${ENDPOINT}/informe?${params.toString()}`);
        return response.data; 
    } catch (error) {
        console.error("Error al generar el informe:", error);
        throw new Error("Fallo al generar el informe con los filtros especificados.");
    }
};

// ----------------------------------------------------
// RF17: ACTUALIZAR ESTADO DEL REPORTE (VISTA ADMIN)
// ----------------------------------------------------

/**
 * Actualiza el estado de un reporte específico.
 * Endpoint: PATCH /api/reportes/{id}/estado?nuevoEstado=...&nota=...
 * @param {Long} id - ID del reporte.
 * @param {String} nuevoEstado - El nuevo estado (ej: PENDIENTE, RESUELTO).
 * @param {String} nota - Nota opcional.
 * @returns {Promise<ReporteResponse>} - El reporte actualizado.
 */
export const actualizarEstado = async (id, nuevoEstado, nota) => {
    try {
        const params = new URLSearchParams();
        // 💡 nuevoEstado es requerido por tu controlador
        params.append('nuevoEstado', nuevoEstado); 
        
        // 💡 nota es opcional
        if (nota) params.append('nota', nota);

        // Envía la petición PATCH con los parámetros en el query
        const response = await api.patch(
            `${ENDPOINT}/${id}/estado?${params.toString()}`,
            null // Body nulo
        );
        
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el estado del reporte:", error);
        throw new Error("No se pudo actualizar el estado del reporte.");
    }
};