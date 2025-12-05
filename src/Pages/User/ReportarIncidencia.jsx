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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Tooltip,
  Chip,
  Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import dayjs from "dayjs";

// Importamos servicios

import { getLockers } from "../../services/ReservaService";
import { getMe } from "../../lib/auth";
import { getMisReportes, createReporte, deleteReporte } from "../../services/ReporteService";

export default function ReportarIncidencia() {
  // --- ESTADOS DE DATOS ---
  const [userId, setUserId] = useState(null);
  const [lockers, setLockers] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DEL FORMULARIO ---
  const [pabellon, setPabellon] = useState("");
  const [piso, setPiso] = useState("");
  const [selectedLockerId, setSelectedLockerId] = useState("");
  const [tipoReporte, setTipoReporte] = useState(""); // "Puerta", "Cerradura", etc.
  const [descripcion, setDescripcion] = useState("");

  // 1. CARGA INICIAL
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const user = await getMe();
      setUserId(user.id);

      const dataLockers = await getLockers();
      setLockers(dataLockers);

      const dataReportes = await getMisReportes();
      setReportes(dataReportes);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE FILTROS (Igual que en Reservar) ---
  const listaLockers = Array.isArray(lockers) ? lockers : [];
  
  const lockersNormalizados = listaLockers.map(l => {
    let _pabellon = "?";
    let _piso = "?";
    if (l.ubicacion) {
        if (typeof l.ubicacion === 'object') {
            _pabellon = l.ubicacion.pabellon || "?";
            _piso = l.ubicacion.piso || "?";
        } else if (typeof l.ubicacion === 'string') {
            const parts = l.ubicacion.split('-'); 
            if (parts.length >= 2) {
                _pabellon = parts[0].trim();
                _piso = parts[1].trim();
            } else {
                _pabellon = l.ubicacion; 
            }
        }
    }
    return { ...l, _pabellon, _piso };
  });

  const pabellonesUnicos = [...new Set(lockersNormalizados.map(l => l._pabellon).filter(p => p !== "?"))].sort();
  
  const pisosDisponibles = [...new Set(
    lockersNormalizados.filter(l => l._pabellon === pabellon).map(l => l._piso)
  )].sort();

  const lockersFiltrados = lockersNormalizados.filter(l => 
    l._pabellon === pabellon && l._piso === piso
  );

  // --- MANEJO DE ENVÍO ---
  const handleEnviarReporte = async () => {
    if (!selectedLockerId || !tipoReporte || !descripcion) {
      alert("Por favor completa todos los campos: Locker, Parte dañada y Descripción.");
      return;
    }

    const payload = {
        descripcion: descripcion,
        tipoReporte: tipoReporte,
        userId: userId,
        lockerId: selectedLockerId
    };

    try {
        await createReporte(payload);
        alert("Reporte enviado con éxito.");
        
        // Resetear form
        setDescripcion("");
        setTipoReporte("");
        setSelectedLockerId("");
        setPabellon("");
        setPiso("");

        // Recargar lista
        const nuevosReportes = await getMisReportes();
        setReportes(nuevosReportes);

    } catch (error) {
        console.error("Error enviando reporte:", error);
        alert("Hubo un error al enviar el reporte.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este reporte?")) return;
    try {
        await deleteReporte(id);
        setReportes(reportes.filter(r => r.id !== id));
    } catch (error) {
        console.error(error);
        alert("Error al eliminar.");
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;

  return (
    <Box sx={{ margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Reportar Incidencia
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Selecciona el locker y la parte afectada en la imagen para generar un reporte.
      </Typography>

      <Grid container spacing={4}>
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
            <Typography variant="h6" gutterBottom>1. Ubicar Locker</Typography>
            
            <Box display="flex" gap={2} mb={2}>
                <FormControl fullWidth size="small">
                    <InputLabel>Pabellón</InputLabel>
                    <Select value={pabellon} label="Pabellón" onChange={(e) => { setPabellon(e.target.value); setPiso(""); setSelectedLockerId(""); }}>
                        {pabellonesUnicos.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl fullWidth size="small" disabled={!pabellon}>
                    <InputLabel>Piso</InputLabel>
                    <Select value={piso} label="Piso" onChange={(e) => { setPiso(e.target.value); setSelectedLockerId(""); }}>
                        {pisosDisponibles.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                    </Select>
                </FormControl>
            </Box>

            <FormControl fullWidth sx={{ mb: 3 }} disabled={!piso}>
                <InputLabel>Número de Locker</InputLabel>
                <Select value={selectedLockerId} label="Número de Locker" onChange={(e) => setSelectedLockerId(e.target.value)}>
                    {lockersFiltrados.map((l) => (
                        <MenuItem key={l.id} value={l.id}>
                            Locker {l.numeroLocker} ({l.estado})
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom>2. Detalle del Problema</Typography>
            
            <TextField
                fullWidth
                label="Tipo de daño (Selecciona en la imagen)"
                value={tipoReporte}
                InputProps={{ readOnly: true }}
                placeholder="Haz click en la imagen de la derecha ->"
                variant="filled"
                sx={{ mb: 2, cursor: 'pointer' }}
                onClick={() => alert("Por favor haz click en los círculos de colores sobre la imagen del locker.")}
            />

            <TextField
                fullWidth
                label="Descripción detallada"
                multiline
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                sx={{ mb: 3 }}
                placeholder="Ej: La puerta no cierra bien..."
            />

            <Button 
                variant="contained" 
                color="error" 
                fullWidth 
                size="large"
                startIcon={<ReportProblemIcon />}
                onClick={handleEnviarReporte}
                disabled={!selectedLockerId || !tipoReporte || !descripcion}
            >
                Enviar Reporte
            </Button>
          </Paper>
        </Grid>

        {/* COLUMNA DERECHA: IMAGEN INTERACTIVA */}
        <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }} elevation={3}>
                <Typography variant="h6" gutterBottom>Selecciona la parte dañada</Typography>
                <Box
                    sx={{
                        position: "relative",
                        display: "inline-block",
                        mt: 2,
                        border: '1px solid #444',
                        borderRadius: 2,
                        overflow: 'hidden'
                    }}
                >
                    {/* IMAGEN LOCKER */}
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/037/844/466/non_2x/locker-vecto-icon-vector.jpg"
                        alt="Locker"
                        style={{ width: "220px", display: "block" }}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/220x400.png?text=Imagen+Locker"; }}
                    />

                    {/* PUNTO 1: PUERTA (Azul) */}
                    <Tooltip title="Puerta" placement="right">
                        <Box
                            onClick={() => setTipoReporte("Puerta")}
                            sx={{
                                position: "absolute",
                                top: "40%", left: "50%",
                                width: 20, height: 20,
                                bgcolor: tipoReporte === "Puerta" ? "white" : "#1976d2",
                                border: "3px solid #1976d2",
                                borderRadius: "50%",
                                cursor: "pointer",
                                transform: "translate(-50%, -50%)",
                                transition: "all 0.2s",
                                boxShadow: tipoReporte === "Puerta" ? "0 0 10px #1976d2" : "none",
                                '&:hover': { transform: "translate(-50%, -50%) scale(1.3)" }
                            }}
                        />
                    </Tooltip>

                    {/* PUNTO 2: CERRADURA (Verde) */}
                    <Tooltip title="Cerradura" placement="right">
                        <Box
                            onClick={() => setTipoReporte("Cerradura")}
                            sx={{
                                position: "absolute",
                                top: "55%", left: "80%",
                                width: 20, height: 20,
                                bgcolor: tipoReporte === "Cerradura" ? "white" : "#2e7d32",
                                border: "3px solid #2e7d32",
                                borderRadius: "50%",
                                cursor: "pointer",
                                transform: "translate(-50%, -50%)",
                                transition: "all 0.2s",
                                boxShadow: tipoReporte === "Cerradura" ? "0 0 10px #2e7d32" : "none",
                                '&:hover': { transform: "translate(-50%, -50%) scale(1.3)" }
                            }}
                        />
                    </Tooltip>

                    {/* PUNTO 3: BISAGRA (Rojo) */}
                    <Tooltip title="Bisagra" placement="left">
                        <Box
                            onClick={() => setTipoReporte("Bisagra")}
                            sx={{
                                position: "absolute",
                                top: "25%", left: "15%",
                                width: 20, height: 20,
                                bgcolor: tipoReporte === "Bisagra" ? "white" : "#d32f2f",
                                border: "3px solid #d32f2f",
                                borderRadius: "50%",
                                cursor: "pointer",
                                transform: "translate(-50%, -50%)",
                                transition: "all 0.2s",
                                boxShadow: tipoReporte === "Bisagra" ? "0 0 10px #d32f2f" : "none",
                                '&:hover': { transform: "translate(-50%, -50%) scale(1.3)" }
                            }}
                        />
                    </Tooltip>
                </Box>
                <Typography variant="caption" sx={{ mt: 2, color: 'text.secondary' }}>
                    Parte seleccionada: <strong>{tipoReporte || "Ninguna"}</strong>
                </Typography>
            </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* LISTA DE REPORTES */}
      <Typography variant="h5" gutterBottom>
        Historial de Reportes
      </Typography>
      
      {reportes.length === 0 ? (
        <Alert severity="info">No has reportado ninguna incidencia aún.</Alert>
      ) : (
        <Grid container spacing={2}>
          {reportes.map((inc) => (
            <Grid item xs={12} sm={6} md={4} key={inc.id}>
              <Card sx={{ bgcolor: "#1e1e1e", color: "white", borderRadius: 2 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" color="primary">
                        Locker {inc.locker?.numeroLocker || "?"}
                    </Typography>
                    <Chip 
                        label={inc.estado || "PENDIENTE"} 
                        size="small"
                        color={inc.estado === "RESUELTO" ? "success" : "warning"}
                    />
                  </Box>
                  
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                    Parte: <span style={{ color: '#90caf9' }}>{inc.tipoReporte}</span>
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', opacity: 0.9 }}>
                    "{inc.descripcion}"
                  </Typography>
                  
                  <Typography variant="caption" color="gray" sx={{ display: "block", mt: 2 }}>
                    Fecha: {dayjs(inc.fechaReporte).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  {/* Solo permitir borrar si está pendiente */}
                  {inc.estado === "PENDIENTE" && (
                      <IconButton size="small" color="error" onClick={() => handleDelete(inc.id)}>
                        <DeleteIcon />
                      </IconButton>
                  )}
                  {inc.estado === "RESUELTO" && (
                      <Tooltip title="Problema resuelto">
                          <CheckCircleIcon color="success" />
                      </Tooltip>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}