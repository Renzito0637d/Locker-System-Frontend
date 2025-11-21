import React, { useState, useEffect } from "react";
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
    // Nuevas importaciones de estado/feedback
    Alert,
    CircularProgress, 
} from "@mui/material";
import { motion } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// 💡 IMPORTAR LA FUNCIÓN DE CREACIÓN DE REPORTE DESDE LA NUEVA RUTA
import { createReporte } from "../../services/ReporteService.jsx"; 
// 💡 IMPORTAR LA FUNCIÓN PARA OBTENER EL USUARIO LOGUEADO
import { getMe } from "../../lib/auth.jsx"; 

// --- Configuración (Constantes) ---
const bloques = ["A", "B", "C", "D", "E", "F"];
const numeros = Array.from({ length: 20 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
);

const PART_TO_TIPO_REPORTE = {
    Cerradura: "FALLA_MECANICA",
    Bisagra: "FALLA_MECANICA",
    Puerta: "PROBLEMA_LIMPIEZA",
};

export default function ReportarIncidencia() {
    // 💡 ESTADOS DE AUTENTICACIÓN Y FORMULARIO
    const [userId, setUserId] = useState(null); 
    const [authLoading, setAuthLoading] = useState(true); 

    const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);
    const [numeroSeleccionado, setNumeroSeleccionado] = useState(null);
    const [selectedPart, setSelectedPart] = useState(null);
    const [description, setDescription] = useState("");
    
    // Estados para la comunicación con el backend (feedback)
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    
    // 🛑 Estados obsoletos (mantenerlos para no romper el render de la sección de listado)
    const [incidencias, setIncidencias] = useState([]);
    const [editId, setEditId] = useState(null); 

    // ----------------------------------------------------
    // RF15 - PASO 1: OBTENER EL ID DEL USUARIO LOGUEADO
    // ----------------------------------------------------
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const user = await getMe();
                setUserId(user.id); // Asumo que getMe().id devuelve el ID numérico
            } catch (error) {
                console.error("No se pudo obtener el ID de usuario logueado:", error);
                setErrorMessage("Error de sesión. No puedes reportar incidencias.");
            } finally {
                setAuthLoading(false);
            }
        };
        fetchUserId();
    }, []); 
    
    // 🛑 Lógica de localStorage y useEffects obsoletos ELIMINADA.

    const resetForm = () => {
        setBloqueSeleccionado(null);
        setNumeroSeleccionado(null);
        setSelectedPart(null);
        setDescription("");
        setEditId(null);
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    // ----------------------------------------------------
    // RF15 - PASO 2: ENVÍO DEL REPORTE A LA API
    // ----------------------------------------------------
    const handleEnviarReporte = async () => {
        if (!bloqueSeleccionado || !numeroSeleccionado || !selectedPart || !description || !userId) {
            setErrorMessage("Debes completar todos los campos y tener una sesión activa.");
            return;
        }
        
        // 🛑 Bloquear lógica obsoleta
        if (editId !== null) {
            setErrorMessage("Por favor, Cancelar el modo 'Actualizar Reporte' antes de enviar a la base de datos.");
            return;
        }

        const tipoReporteFinal = PART_TO_TIPO_REPORTE[selectedPart] || "OTRO";

        // 🚨 CRÍTICO: Debes obtener el ID numérico real del locker (Long).
        // Si no tienes el endpoint de búsqueda, este valor fallará en el backend.
        const dummyLockerIdForBackend = 1; 

        const createRequest = {
            userId: userId, // 💡 ID real del usuario
            lockerId: dummyLockerIdForBackend, 
            descripcion: description,
            tipoReporte: tipoReporteFinal,
        };

        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            await createReporte(createRequest); 
            
            setSuccessMessage(`✅ Reporte enviado con éxito para el Locker ${bloqueSeleccionado}-${numeroSeleccionado}.`);
            
            resetForm(); 
        } catch (error) {
            setErrorMessage(error.message || "Fallo en el envío del reporte al servidor.");
        } finally {
            setIsLoading(false);
        }
    };
    
    // 🛑 Mantener las funciones obsoletas para el render de tarjetas
    const handleDelete = (id) => { setIncidencias((prev) => prev.filter((inc) => inc.id !== id)); };
    const handleEdit = (id) => { 
        // Lógica de edición local...
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
    const handleClearAll = () => { setIncidencias([]); resetForm(); };
    

    // Si el componente está cargando el ID de usuario
    if (authLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Verificando sesión...</Typography>
            </Box>
        );
    }
    
    // ----------------------------------------------------
    // --- Renderización del Formulario (Tus Estilos) ---
    // ----------------------------------------------------
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Reportar Incidencia en Locker
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
            
            {/* ... (Tu código de selección de bloque y número) ... */}
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

                    {/* Partes seleccionables (Mantener la lógica de selección visual) */}
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
            </Paper>

            {/* Descripción y Botones */}
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

            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={handleEnviarReporte}
                        disabled={isLoading || editId !== null || !userId} // Deshabilitar si está cargando o no autenticado
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

            {/* Incidencias reportadas (Mantener la estructura, pero ahora estará vacío) */}
            <Typography variant="h6" gutterBottom>
                Historial Local (deshabilitado)
            </Typography>
            <Grid container spacing={2}>
                {incidencias.length === 0 ? (
                    <Typography color="text.secondary" sx={{ ml: 2 }}>
                        No hay incidencias registradas.
                    </Typography>
                ) : (
                    <Typography color="text.error" sx={{ ml: 2 }}>
                        El historial se ha desconectado de la API.
                    </Typography>
                )}
            </Grid>
        </Box>
    );
}