import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import {
    Box,
    Paper,
    Typography,
    Chip,
    Container,
    IconButton,
    Stack,
    Button,
    // Nuevas importaciones para el estado de la API
    CircularProgress,
    Alert,
} from "@mui/material";

import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import { motion } from "framer-motion";

// 💡 IMPORTAR FUNCIONES DEL SERVICE (Asegúrate que la ruta es correcta)
import { 
    getAllMappedReports, 
    actualizarEstado, 
    deleteReporte 
} from "../../services/ReporteService.jsx"; 

// --- Datos Estáticos y Lógica de localStorage ELIMINADOS ---

export default function ReportsView() {
    // 💡 ESTADOS DE LA API (Reemplaza los estados estáticos)
    const [reportes, setReportes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // -----------------------------------------------------
    // FUNCIÓN DE CARGA DE DATOS (RF15 - Conexión Real)
    // -----------------------------------------------------
    const fetchReports = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const data = await getAllMappedReports();
            setReportes(data);
        } catch (err) {
            setError("No se pudo cargar la lista de reportes desde el servidor.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchReports();
    }, [fetchReports]);


    // -----------------------------------------------------
    // 💡 HANDLER RF17: ACTUALIZAR ESTADO VÍA API
    // -----------------------------------------------------
    const handleChangeEstado = async (id, nuevoEstado) => {
        setSuccessMessage(null);
        setError(null);
        
        try {
            // Llama a la API (el backend espera el estado en MAYÚSCULAS)
            const estadoMayusculas = nuevoEstado.toUpperCase().replace(' ', '_'); // Convierte "en revisión" a "EN_REVISION"
            const updatedReporte = await actualizarEstado(id, estadoMayusculas, `Marcado como ${nuevoEstado} por Admin.`);
            
            // Actualizar la lista local
            setReportes((prev) =>
                prev.map((r) => 
                    r.id === id ? updatedReporte : r 
                )
            );
            setSuccessMessage(`El reporte #${id} actualizado a ${nuevoEstado}.`);

        } catch (e) {
            setError(e.message || `Fallo al actualizar el estado del reporte #${id}.`);
        }
    };

    // -----------------------------------------------------
    // HANDLER DELETE (Llama a la API)
    // -----------------------------------------------------
    const handleDelete = async (id) => {
        const ok = window.confirm(`¿Estás seguro de eliminar el reporte #${id}? Esta acción es irreversible.`);
        if (!ok) return;

        setSuccessMessage(null);
        setError(null);
        try {
            await deleteReporte(id);

            setReportes((prev) => prev.filter((r) => r.id !== id));
            setSuccessMessage(`Reporte #${id} eliminado con éxito.`);
        } catch (e) {
            setError(e.message || `Fallo al eliminar el reporte #${id}.`);
        }
    };

    // Lógica de Renderización de Íconos (ADAPTADA para EN_PROCESO)
    const renderIcon = (estado) => {
        if (!estado) return <ReportProblemRoundedIcon color="disabled" fontSize="large" />;
        const lowerEstado = estado.toLowerCase().replace('_', ' '); // Normalizar a minúsculas
        
        if (lowerEstado === "pendiente") {
            return <ReportProblemRoundedIcon color="warning" fontSize="large" />;
        }
        if (lowerEstado === "en_proceso" || lowerEstado === "en revisión") { 
            return <InfoRoundedIcon color="info" fontSize="large" />;
        }
        if (lowerEstado === "resuelto") {
            return <CheckCircleRoundedIcon color="success" fontSize="large" />;
        }
        return <ReportProblemRoundedIcon color="disabled" fontSize="large" />;
    };
    
    // Función de ayuda para determinar el color del Chip
    const getChipColor = (estado) => {
        if (!estado) return "default";
        const lowerEstado = estado.toLowerCase().replace('_', ' ');
        if (lowerEstado === "pendiente") return "warning";
        if (lowerEstado === "en_proceso" || lowerEstado === "en revisión") return "info";
        if (lowerEstado === "resuelto") return "success";
        return "default";
    };


    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: "#0D1117" }}>
                <CircularProgress sx={{ color: '#fff' }} />
                <Typography variant="h6" sx={{ ml: 2, color: '#fff' }}>Cargando reportes desde el servidor...</Typography>
            </Box>
        );
    }
    
    return (
        <Box sx={{ bgcolor: "#0D1117", minHeight: "100vh", py: 4 }}>
            <Container maxWidth="lg">
                {/* Título animado (Mantenido) */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography
                        variant="h3"
                        gutterBottom
                        sx={{ color: "#fff", fontWeight: "bold" }}
                    >
                        📋 Reportes de Lockers
                    </Typography>
                </motion.div>
                
                {/* Mensajes de Feedback */}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
                
                {reportes.length === 0 && !error && (
                    <Alert severity="info" sx={{ mt: 2 }}>No hay reportes activos en el sistema.</Alert>
                )}


                <Stack spacing={3}>
                    {reportes.map((r, i) => (
                        <motion.div
                            key={r.id}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <Paper
                                elevation={6}
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    bgcolor: "#161B22",
                                    color: "#fff",
                                    "&:hover": { bgcolor: "#1F242C", transform: "scale(1.01)" },
                                    transition: "all 0.3s ease",
                                }}
                            >
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={2}
                                    sx={{ mb: 2 }}
                                >
                                    {renderIcon(r.estado)}
                                    <Box>
                                        <Typography variant="h6">
                                            {/* 💡 Usa los campos reales del DTO */}
                                            Locker {r.numeroLocker || 'N/A'} – {r.userName || 'Usuario Desconocido'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "gray" }}>
                                            {r.descripcion}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "gray" }}>
                                            {/* 💡 Muestra la fecha del DTO */}
                                            Fecha: {r.fechaReporte ? new Date(r.fechaReporte).toLocaleString() : 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={r.estado?.replace('_', ' ') || 'SIN ESTADO'}
                                        sx={{ ml: "auto" }}
                                        color={getChipColor(r.estado)}
                                    />
                                </Stack>

                                {/* Botones de acción (RF17) */}
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        variant="outlined"
                                        color="warning"
                                        size="small"
                                        // 💡 Llamada a la API con estado en MAYÚSCULAS
                                        onClick={() => handleChangeEstado(r.id, "pendiente")}
                                    >
                                        Pendiente
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="info"
                                        size="small"
                                        onClick={() => handleChangeEstado(r.id, "en proceso")}
                                    >
                                        En Proceso
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        onClick={() => handleChangeEstado(r.id, "resuelto")}
                                    >
                                        Resuelto
                                    </Button>

                                    <IconButton
                                        size="small"
                                        sx={{ ml: "auto", color: "gray" }}
                                        onClick={() => handleDelete(r.id)}
                                        title="Eliminar Reporte"
                                    >
                                        <DeleteRoundedIcon />
                                    </IconButton>
                                </Stack>
                            </Paper>
                        </motion.div>
                    ))}
                </Stack>
            </Container>
        </Box>
    );
}