import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    Typography,
    Button,
    Grid,
    Paper,
    TextField,
    Card,
    CardContent,
    CardActions,
    Divider,
    IconButton,
    Alert, // Nuevo para mensajes de éxito/error
    CircularProgress, // Nuevo para estado de carga
} from "@mui/material";
import { motion } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// 💡 IMPORTAR LA FUNCIÓN DE CREACIÓN DE REPORTE
import { createReporte } from "../../lib/reporteApi"; // ASEGÚRATE DE QUE LA RUTA SEA CORRECTA

// --- DATA LOCAL ELIMINADA ---
const bloques = ["A", "B", "C", "D", "E", "F"];
const numeros = Array.from({ length: 20 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
);

// Mapeo de la parte visual (Puerta, Cerradura, etc.) a tu Enum de backend (TipoReporte)
const PART_TO_TIPO_REPORTE = {
    Cerradura: "FALLA_MECANICA", // Falla en el mecanismo
    Bisagra: "FALLA_MECANICA",   // Falla en la estructura
    Puerta: "PROBLEMA_LIMPIEZA", // Se puede interpretar como suciedad o falla estructural no mecánica
    // 💡 AJUSTA ESTE MAPEO PARA QUE COINCIDA CON TU ENUM EN JAVA
};

// 🚨 ESTE COMPONENTE YA NO GESTIONA EL LISTADO, SOLO LA CREACIÓN. 
// La lógica de LISTAR incidencias (el array 'incidencias' y localStorage)
// será reemplazada por una llamada a la API si quieres ver el historial del usuario.

export default function ReportarIncidencia() {
    // 🚨 NOTA IMPORTANTE: Debes obtener el userId real del usuario logueado.
    // Usaremos un valor temporal, pero esto debe ser manejado por tu AuthContext.
    const MOCK_USER_ID = 1;

    const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);
    const [numeroSeleccionado, setNumeroSeleccionado] = useState(null);
    const [selectedPart, setSelectedPart] = useState(null);
    const [description, setDescription] = useState("");
    
    // Estados para la comunicación con el backend
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // --- LÓGICA DE LISTADO LOCAL ELIMINADA ---
    // Eliminamos incidencias, setIncidencias, useEffect(localStorage), editId, setEditId.
    // Si quieres mostrar el historial de reportes del usuario, debes crear
    // un nuevo estado para ello y llamar a un endpoint: GET /api/reportes/user/{userId}

    const resetForm = () => {
        setBloqueSeleccionado(null);
        setNumeroSeleccionado(null);
        setSelectedPart(null);
        setDescription("");
        // setEditId(null); <-- Eliminado
        setErrorMessage(null);
    };

    // ----------------------------------------------------
    // 💡 FUNCIÓN CLAVE: ENVÍO DEL REPORTE A LA API (RF15)
    // ----------------------------------------------------
    const handleEnviarReporte = async () => {
        if (!bloqueSeleccionado || !numeroSeleccionado || !selectedPart || !description) {
            setErrorMessage("Por favor, completa la selección de Locker, Parte y la Descripción.");
            return;
        }

        const lockerFinalId = `${bloqueSeleccionado}${numeroSeleccionado}`; // Ej: A01 (ajusta esto si el ID de tu locker es solo un número Long)
        const tipoReporteFinal = PART_TO_TIPO_REPORTE[selectedPart];

        // 🚨 SI TU LOCKER_ID ES UN NÚMERO LONG, DEBES BUSCAR EL ID EN BASE DE DATOS,
        // no usar el string "A-01". Asumo que tienes una forma de mapear A-01 a un Long ID.
        // Por ahora, solo usamos el ID de texto para la vista:
        const dummyLockerIdForBackend = 1; // 🚨 REEMPLAZA ESTO CON LA LÓGICA DE BÚSQUEDA DEL ID REAL

        const createRequest = {
            userId: MOCK_USER_ID,
            // 💡 Aquí DEBERÍA IR EL ID NUMÉRICO REAL del locker (Long), no el código A-01
            lockerId: dummyLockerIdForBackend, 
            descripcion: description,
            tipoReporte: tipoReporteFinal,
        };

        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            // LLAMADA A LA API
            await createReporte(createRequest); 
            
            setSuccessMessage(`✅ Reporte enviado con éxito para el Locker ${lockerFinalId}.`);
            
            resetForm(); // Limpiar el formulario
        } catch (error) {
            setErrorMessage(error.message || "Fallo en el envío del reporte al servidor.");
        } finally {
            setIsLoading(false);
        }
    };
    // --- LÓGICA DE LISTADO LOCAL ELIMINADA ---

    // const handleEdit = ... <-- Eliminado
    // const handleDelete = ... <-- Eliminado
    // const handleClearAll = ... <-- Eliminado
    // ----------------------------------------------------

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Reportar Incidencia en Locker
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Mensajes de Feedback */}
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

            {/* Selección de bloque */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                    1. Selecciona el bloque:
                </Typography>
                <Grid container spacing={1}>
                    {bloques.map((bloque) => (
                        <Grid item key={bloque}>
                            <Button
                                variant={bloqueSeleccionado === bloque ? "contained" : "outlined"}
                                color="primary"
                                onClick={() => setBloqueSeleccionado(bloque)}
                            >
                                {bloque}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/* Selección de número */}
            {/* El diseño de la vista está bien, solo hemos adaptado la lógica de envío */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                    2. Selecciona el número:
                </Typography>
                <Grid container spacing={1}>
                    {numeros.map((num) => (
                        <Grid item key={num}>
                            <Button
                                variant={numeroSeleccionado === num ? "contained" : "outlined"}
                                color="secondary"
                                onClick={() => setNumeroSeleccionado(num)}
                            >
                                {num}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/* Imagen interactiva (solo para selección visual) */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                    3. Selecciona la parte afectada:
                </Typography>
                <Box
                    sx={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        mb: 2,
                    }}
                >
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/037/844/466/non_2x/locker-vecto-icon-vector.jpg"
                        alt="Locker"
                        style={{ width: "200px", borderRadius: "8px" }}
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/200x400.png?text=Locker";
                        }}
                    />

                    {/* Partes seleccionables */}
                    {['Puerta', 'Cerradura', 'Bisagra'].map(part => (
                        <motion.div
                            key={part}
                            whileHover={{ scale: 1.2 }}
                            style={{
                                position: "absolute",
                                // ... (Tus estilos de posición original) ...
                                background: selectedPart === part ? '#ff0077' : '#1976d2', // Resalta la parte seleccionada
                                borderRadius: "50%",
                                width: "15px",
                                height: "15px",
                                cursor: "pointer",
                                // Posiciones adaptadas de tu código original:
                                top: part === 'Puerta' ? '40%' : part === 'Cerradura' ? '50.7%' : '28%',
                                left: part === 'Puerta' ? '51%' : part === 'Cerradura' ? '48.7%' : '48%', 
                            }}
                            title={part}
                            onClick={() => setSelectedPart(part)}
                        />
                    ))}
                </Box>
                {selectedPart && (
                    <Alert severity="info" sx={{ mt: 1 }}>
                        Parte seleccionada: **{selectedPart}** (Tipo de reporte: **{PART_TO_TIPO_REPORTE[selectedPart] || 'OTRO'}**)
                    </Alert>
                )}
            </Paper>
            

            {/* Descripción y Resumen */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    4. Describe el problema y envía
                </Typography>
                <TextField
                    fullWidth
                    label="Descripción del problema"
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mb: 2 }}
                    required
                />
            
                <Typography>
                    <strong>Locker a reportar:</strong>{" "}
                    {bloqueSeleccionado && numeroSeleccionado
                        ? `${bloqueSeleccionado}-${numeroSeleccionado}`
                        : "Ninguno"}
                </Typography>
            </Paper>


            {/* Botón de Envío Real */}
            <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={handleEnviarReporte}
                sx={{ mb: 4 }}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
                {isLoading ? "Enviando Reporte..." : "Enviar Reporte"}
            </Button>


            <Divider sx={{ mb: 3 }} />

            {/* 🚨 SECCIÓN DE LISTADO LOCAL ELIMINADA 🚨 
            Si necesitas mostrar el historial de reportes del usuario, 
            debes crear un nuevo componente o implementar la llamada al endpoint 
            GET /api/reportes/user/{userId} y mostrar el resultado aquí.
            */}
            <Typography variant="h6" color="text.secondary">
                La sección de edición y listado local ha sido eliminada. 
                El historial de reportes debe ser gestionado por el backend.
            </Typography>

        </Box>
    );
}