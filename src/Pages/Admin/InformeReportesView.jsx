// src/Pages/Admin/InformeReportesView.jsx

import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    TextField,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    MenuItem,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

// 💡 Importamos la función que creamos en el servicio
import { generarInforme } from "../../services/ReporteService.jsx"; 

// Opciones de estado para el filtro (deben coincidir con tu Enum en Java)
const ESTADOS = [
    { value: "", label: "Todos los estados" },
    { value: "PENDIENTE", label: "Pendiente" },
    { value: "EN_PROCESO", label: "En Proceso" },
    { value: "RESUELTO", label: "Resuelto" },
];

// Encabezados de la tabla para ReporteResponse
const REPORT_HEADERS = [
    "ID",
    "Locker",
    "Usuario",
    "Tipo",
    "Estado",
    "Fecha Creación",
];

export default function InformeReportesView() {
    // Estado para los filtros de búsqueda
    const [filters, setFilters] = useState({
        estado: "",
        lockerId: "",
        userId: "",
        fechaInicio: "",
        fechaFin: "",
    });

    // Estado para los resultados del informe
    const [reportes, setReportes] = useState([]);
    
    // Estados de UI
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Maneja el cambio en cualquier campo de filtro
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ----------------------------------------------------
    // 💡 FUNCIÓN PRINCIPAL: GENERAR INFORME (RF16)
    // ----------------------------------------------------
    const handleGenerarInforme = async () => {
        setError(null);
        setIsLoading(true);
        setReportes([]);

        // Mapear los filtros para enviar al servicio. 
        // Solo enviamos los campos que tienen valor.
        const filtersToSend = {};
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                // Convertir IDs a número si son campos numéricos
                if (key === 'lockerId' || key === 'userId') {
                    const numValue = Number(filters[key]);
                    if (!isNaN(numValue)) {
                        filtersToSend[key] = numValue;
                    }
                } else {
                    filtersToSend[key] = filters[key];
                }
            }
        });
        
        try {
            const results = await generarInforme(filtersToSend);
            setReportes(results);
        } catch (err) {
            setError(err.message || "No se pudo generar el informe. Intente de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Generador de Informes (RF16)
            </Typography>
            
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>Filtros de Búsqueda</Typography>
                <Grid container spacing={3}>
                    
                    {/* Filtro por Estado */}
                    <Grid item xs={12} sm={4}>
                        <TextField
                            select
                            fullWidth
                            label="Estado del Reporte"
                            name="estado"
                            value={filters.estado}
                            onChange={handleFilterChange}
                        >
                            {ESTADOS.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Filtro por Locker ID */}
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="ID del Locker"
                            name="lockerId"
                            type="number"
                            value={filters.lockerId}
                            onChange={handleFilterChange}
                        />
                    </Grid>

                    {/* Filtro por User ID */}
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="ID del Usuario"
                            name="userId"
                            type="number"
                            value={filters.userId}
                            onChange={handleFilterChange}
                        />
                    </Grid>
                    
                    {/* Filtro por Fecha Inicio */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Fecha de Inicio (YYYY-MM-DDTHH:MM)"
                            name="fechaInicio"
                            value={filters.fechaInicio}
                            onChange={handleFilterChange}
                            helperText="Ej: 2024-01-01T00:00 (requerido por Spring Boot)"
                        />
                    </Grid>

                    {/* Filtro por Fecha Fin */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Fecha de Fin (YYYY-MM-DDTHH:MM)"
                            name="fechaFin"
                            value={filters.fechaFin}
                            onChange={handleFilterChange}
                            helperText="Ej: 2024-12-31T23:59"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleGenerarInforme}
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                        >
                            {isLoading ? "Generando Informe..." : "Generar Informe"}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Sección de Resultados */}
            <Typography variant="h6" gutterBottom>Resultados ({reportes.length})</Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            {!isLoading && reportes.length === 0 && !error && (
                 <Alert severity="info">No se encontraron reportes que coincidan con los filtros aplicados.</Alert>
            )}

            {!isLoading && reportes.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="reportes table">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'lightblue' }}>
                                {REPORT_HEADERS.map((header) => (
                                    <TableCell key={header} sx={{ fontWeight: 'bold' }}>{header}</TableCell>
                                ))}
                                <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reportes.map((reporte) => (
                                <TableRow
                                    key={reporte.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{reporte.id}</TableCell>
                                    {/* Asumo que ReporteResponse tiene los campos userName y numeroLocker */}
                                    <TableCell>{reporte.numeroLocker || 'N/A'}</TableCell>
                                    <TableCell>{reporte.userName || 'N/A'}</TableCell>
                                    <TableCell>{reporte.tipoReporte}</TableCell>
                                    <TableCell>{reporte.estado}</TableCell>
                                    {/* Muestra la fecha de creación */}
                                    <TableCell>{reporte.fechaReporte ? new Date(reporte.fechaReporte).toLocaleString() : 'N/A'}</TableCell>
                                    <TableCell>{reporte.descripcion}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}