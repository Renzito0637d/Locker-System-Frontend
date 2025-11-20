// src/Pages/User/ReportarIncidencia.jsx

import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Grid,
    Paper,
    TextField,
    // Estilos de tu código original
    Card,
    CardContent,
    CardActions,
    Divider,
    IconButton,
    // Nuevas importaciones de estado/feedback
    Alert,
    CircularProgress, 
} from "@mui/material";
import { motion } from "framer-motion";
// Íconos de tu código original (Mantenidos)
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// 💡 IMPORTAR LA FUNCIÓN DE CREACIÓN DE REPORTE
import { createReporte } from "../../services/ReporteService.jsx"; 


// --- Configuración (Constantes) ---
const bloques = ["A", "B", "C", "D", "E", "F"];
const numeros = Array.from({ length: 20 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
);

// Mapeo de la parte visual a tu Enum de backend
const PART_TO_TIPO_REPORTE = {
    Cerradura: "FALLA_MECANICA",
    Bisagra: "FALLA_MECANICA",
    Puerta: "PROBLEMA_LIMPIEZA",
};

export default function ReportarIncidencia() {
    // 🚨 NOTA CRÍTICA: Debes obtener el userId real.
    const MOCK_USER_ID = 1; // TEMPORAL

    const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);
    const [numeroSeleccionado, setNumeroSeleccionado] = useState(null);
    const [selectedPart, setSelectedPart] = useState(null);
    const [description, setDescription] = useState("");
    
    // --- ESTADOS DE LA LÓGICA ANTERIOR (MANTENIDOS SOLO PARA EL LISTADO FINAL, PERO SIN LOCALSTORAGE) ---
    const [editId, setEditId] = useState(null);
    // 🛑 ADVERTENCIA: Este array ahora estará vacío y la lógica de edición no llamará a la API.
    // Solo existe para no romper la sección de renderizado de tarjetas.
    const [incidencias, setIncidencias] = useState([]); 
    
    // --- ESTADOS PARA LA CONEXIÓN (NUEVOS) ---
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    
    // 🛑 LÓGICA DE LOCALSTORAGE ELIMINADA:
    // Se eliminó el useEffect que guardaba `incidencias` en localStorage.
    // Se eliminó la inicialización de `incidencias` leyendo localStorage.


    const resetForm = () => {
        setBloqueSeleccionado(null);
        setNumeroSeleccionado(null);
        setSelectedPart(null);
        setDescription("");
        setEditId(null);
        setErrorMessage(null); // Limpiamos errores al resetear
    };

    // ----------------------------------------------------
    // 💡 FUNCIÓN CLAVE: ENVÍO DEL REPORTE A LA API (RF15)
    // ----------------------------------------------------
    const handleEnviarReporte = async () => {
        // Validar que no estemos en modo edición de la lógica local antigua
        if (editId !== null) {
            setErrorMessage("No se puede enviar. Primero Cancela el modo 'Actualizar Reporte' o limpia el formulario.");
            return;
        }

        if (!bloqueSeleccionado || !numeroSeleccionado || !selectedPart || !description) {
            setErrorMessage("Por favor, completa la selección de Locker, Parte y la Descripción.");
            return;
        }

        const tipoReporteFinal = PART_TO_TIPO_REPORTE[selectedPart] || "OTRO";

        // 🚨 REEMPLAZA ESTO: Debes obtener el ID numérico real del locker (Long) de tu base de datos.
        const dummyLockerIdForBackend = 1; 

        const createRequest = {
            userId: MOCK_USER_ID,
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
            
            setSuccessMessage(`✅ Reporte enviado con éxito para el Locker ${bloqueSeleccionado}-${numeroSeleccionado}.`);
            
            resetForm(); 
        } catch (error) {
            setErrorMessage(error.message || "Fallo en el envío del reporte al servidor.");
        } finally {
            setIsLoading(false);
        }
    };
    
    // 🛑 ADVERTENCIA: Mantenemos estas funciones, pero su propósito de editar/borrar
    // LOCALMENTE no tiene sentido en un sistema real. Solo están para evitar errores de referencia.
    // En la vida real, estas funciones deberían ser reemplazadas por llamadas a la API.
    const handleDelete = (id) => {
        setIncidencias((prev) => prev.filter((inc) => inc.id !== id));
        if (editId === id) resetForm();
    };

    const handleEdit = (id) => {
        const inc = incidencias.find((i) => i.id === id);
        if (!inc) return;
        const [bloque, numero] = inc.locker.split("-");
        setBloqueSeleccionado(bloque || null);
        setNumeroSeleccionado(numero || null);
        setSelectedPart(inc.part || null);
        setDescription(inc.description || "");
        setEditId(inc.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleClearAll = () => {
        const ok = window.confirm("¿Borrar todas las incidencias guardadas?");
        if (!ok) return;
        setIncidencias([]);
        resetForm();
    };


    // ----------------------------------------------------
    // --- Renderización del Formulario (Tus Estilos) ---
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
                    Selecciona el bloque:
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
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Selecciona el número:
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

            {/* Imagen interactiva */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>3. Selecciona la parte afectada:</Typography>
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
                                background: selectedPart === part ? '#ff0077' : '#1976d2', 
                                borderRadius: "50%",
                                width: "15px",
                                height: "15px",
                                cursor: "pointer",
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

            {/* Descripción */}
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
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography>
                    <strong>Locker seleccionado:</strong>{" "}
                    {bloqueSeleccionado && numeroSeleccionado
                        ? `${bloqueSeleccionado}-${numeroSeleccionado}`
                        : "Ninguno"}
                </Typography>
                <Typography>
                    <strong>Parte seleccionada:</strong> {selectedPart || "Ninguna"}
                </Typography>
                <Typography>
                    <strong>Descripción:</strong> {description || "Sin descripción"}
                </Typography>
            </Paper>

            {/* Botones enviar / cancelar / borrar todo (ADAPTADO) */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={handleEnviarReporte}
                        disabled={isLoading || editId !== null} // Deshabilitar si está cargando o en modo edición local
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isLoading ? "Enviando Reporte..." : (editId ? "Actualizar Reporte (local)" : "Enviar Reporte")}
                    </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Button variant="outlined" fullWidth onClick={resetForm}>
                        Cancelar
                    </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Button variant="outlined" color="error" fullWidth onClick={handleClearAll}>
                        Borrar todas
                    </Button>
                </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* Incidencias reportadas (Mantener la estructura de tus Cards) */}
            <Typography variant="h6" gutterBottom>
                Incidencias reportadas (Historial Local - Ahora siempre vacío)
            </Typography>
            <Grid container spacing={2}>
                {incidencias.length === 0 ? (
                    <Typography color="text.secondary" sx={{ ml: 2 }}>
                        No hay incidencias registradas.
                    </Typography>
                ) : (
                    incidencias.map((inc) => (
                        <Grid item xs={12} md={6} lg={4} key={inc.id}>
                            <Card sx={{ bgcolor: "#1e1e2f", color: "white" }}>
                                <CardContent>
                                    <Typography variant="h6">Locker {inc.locker}</Typography>
                                    <Typography variant="body2" color="lightblue">
                                        Parte: {inc.part}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {inc.description}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="gray"
                                        sx={{ display: "block", mt: 1 }}
                                    >
                                        Fecha: {inc.date}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => handleEdit(inc.id)}
                                        title="Editar"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(inc.id)}
                                        title="Eliminar"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    );
}