import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  CircularProgress,
  Chip
} from "@mui/material";
// Asumiendo que estas dependencias están instaladas en tu proyecto:
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/es"; 
import { getMisReservas } from "../../services/ReservaService";

// Asegúrate de que este archivo se encuentre en src/services/reservaService.js


export default function MisLockers() {
  // --- 1. Estados ---
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para filtros y orden
  const [sortField, setSortField] = useState("id");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // --- 2. Carga de Datos ---
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const data = await getMisReservas();
      // Solo mostramos las reservas que ya fueron APROBADAS por el admin
      const aprobadas = Array.isArray(data) 
        ? data.filter((r) => r.estadoReserva === "APROBADA")
        : [];
      setReservas(aprobadas);
    } catch (error) {
      console.error("Error cargando mis lockers:", error);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. Lógica de Filtrado y Ordenamiento (useMemo) ---
  const processedRows = useMemo(() => {
    // A. Filtrar por rango de fechas
    const filtered = reservas.filter((row) => {
      // Si no hay fechas seleccionadas, pasa todo
      if (!startDate && !endDate) return true;

      const inicio = dayjs(row.fechaInicio);
      const fin = dayjs(row.fechaFin);

      // Lógica:
      // - Si seleccionaste StartDate, la reserva debe iniciar DESPUÉS de esa fecha.
      // - Si seleccionaste EndDate, la reserva debe terminar ANTES de esa fecha.
      const afterStart = !startDate || inicio.isAfter(startDate) || inicio.isSame(startDate);
      const beforeEnd = !endDate || fin.isBefore(endDate) || fin.isSame(endDate);

      return afterStart && beforeEnd;
    });

    // B. Ordenar resultados filtrados
    return filtered.sort((a, b) => {
      if (sortField === "id") {
        return a.id - b.id;
      }
      if (sortField === "locker") {
        // Orden numérico natural para lockers (ej: "10" va después de "2")
        const numA = a.locker?.numeroLocker || "";
        const numB = b.locker?.numeroLocker || "";
        return numA.localeCompare(numB, undefined, { numeric: true });
      }
      if (sortField === "ubicacion") {
        // Orden alfabético por Pabellón
        const locA = a.locker?.ubicacion?.pabellon || "";
        const locB = b.locker?.ubicacion?.pabellon || "";
        return locA.localeCompare(locB);
      }
      return 0;
    });
  }, [reservas, startDate, endDate, sortField]);

  // Columnas de la tabla
  const columns = [
    { id: "id", label: "ID", minWidth: 50 },
    { id: "locker", label: "N° Locker", minWidth: 100 },
    { id: "ubicacion", label: "Ubicación", minWidth: 150 },
    { id: "fechaInicio", label: "Desde", minWidth: 170 },
    { id: "fechaFin", label: "Hasta", minWidth: 170 },
    { id: "estado", label: "Estado", minWidth: 100 },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Mis Lockers Activos
      </Typography>

      {/* BARRA DE FILTROS Y HERRAMIENTAS */}
      <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            
            {/* Selector de Orden */}
            <TextField
                select
                label="Ordenar por"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                sx={{ minWidth: 180 }}
                size="small"
            >
                <MenuItem value="id">ID Reserva</MenuItem>
                <MenuItem value="locker">Número Locker</MenuItem>
                <MenuItem value="ubicacion">Ubicación</MenuItem>
            </TextField>

            {/* Filtros de Fecha */}
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                <DateTimePicker
                    label="Inicio desde"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{ textField: { size: 'small', sx: { minWidth: 220 } } }}
                />
                <DateTimePicker
                    label="Fin hasta"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{ textField: { size: 'small', sx: { minWidth: 220 } } }}
                />
            </LocalizationProvider>

            {/* Botón limpiar */}
            {(startDate || endDate) && (
                <Typography 
                    variant="body2" 
                    sx={{ 
                        cursor: 'pointer', 
                        color: 'primary.main', 
                        textDecoration: 'underline',
                        fontWeight: 'bold'
                    }}
                    onClick={() => { setStartDate(null); setEndDate(null); }}
                >
                    Limpiar fechas
                </Typography>
            )}
        </Box>
      </Paper>

      {/* TABLA DE DATOS */}
      <TableContainer component={Paper} sx={{ maxHeight: 500, boxShadow: 3 }}>
        <Table stickyHeader aria-label="tabla mis lockers">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    minWidth: column.minWidth,
                    fontWeight: "bold",
                    backgroundColor: "#212121", // Fondo oscuro para cabecera
                    color: "#fff",              // Texto blanco
                    borderBottom: "1px solid #424242"
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {processedRows.length > 0 ? (
              processedRows.map((row) => {
                // Formateo de Ubicación (ej: A - Piso 2)
                const pabellon = row.locker?.ubicacion?.pabellon || "?";
                const piso = row.locker?.ubicacion?.piso || "?";
                const ubicacionStr = `Pabellón ${pabellon} - Piso ${piso}`;

                return (
                  <TableRow hover tabIndex={-1} key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {row.locker?.numeroLocker}
                    </TableCell>
                    <TableCell>{ubicacionStr}</TableCell>
                    <TableCell>
                        {dayjs(row.fechaInicio).format("DD/MM/YYYY HH:mm")}
                    </TableCell>
                    <TableCell>
                        {dayjs(row.fechaFin).format("DD/MM/YYYY HH:mm")}
                    </TableCell>
                    <TableCell>
                        <Chip 
                            label={row.estadoReserva} 
                            color="success" 
                            size="small" 
                            variant="filled" 
                        />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No tienes lockers aprobados que coincidan con los filtros.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}