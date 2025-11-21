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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Tooltip,
  IconButton,
  DialogActions
} from "@mui/material";
import LockOpenIcon from '@mui/icons-material/LockOpen'; // Ícono para liberar
// Asumiendo que estas dependencias están instaladas en tu proyecto:
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { getMisReservas, deleteReserva } from "../../services/ReservaService";

// Asegúrate de que este archivo se encuentre en src/services/reservaService.js


export default function MisLockers() {
  // --- 1. Estados ---
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedToLiberar, setSelectedToLiberar] = useState(null); // Para el diálogo

  // Estados para filtros y orden
  const [sortField, setSortField] = useState("id");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // --- 2. Carga de Datos ---
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await getMisReservas();
      // Solo mostramos las reservas que ya fueron APROBADAS
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

  // --- 3. Lógica de Liberación (DELETE) ---
  const handleLiberarClick = (reserva) => {
    setSelectedToLiberar(reserva);
  };

  const handleConfirmLiberar = async () => {
    if (!selectedToLiberar) return;

    try {
      // Llamamos al endpoint DELETE. 
      // Gracias a tu cambio en el Backend, esto pondrá el locker en DISPONIBLE automáticamente.
      await deleteReserva(selectedToLiberar.id);

      // Actualizamos la tabla quitando la reserva eliminada
      setReservas((prev) => prev.filter(r => r.id !== selectedToLiberar.id));

      setSelectedToLiberar(null);
    } catch (error) {
      console.error("Error liberando locker:", error);
      alert("Hubo un error al intentar liberar el locker.");
    }
  };

  // --- 4. Lógica de Filtrado y Ordenamiento ---
  const processedRows = useMemo(() => {
    // A. Filtrar por fecha
    const filtered = reservas.filter((row) => {
      if (!startDate && !endDate) return true;
      const inicio = dayjs(row.fechaInicio);
      const fin = dayjs(row.fechaFin);
      const afterStart = !startDate || inicio.isAfter(startDate) || inicio.isSame(startDate);
      const beforeEnd = !endDate || fin.isBefore(endDate) || fin.isSame(endDate);
      return afterStart && beforeEnd;
    });

    // B. Ordenar
    return filtered.sort((a, b) => {
      if (sortField === "id") return a.id - b.id;
      if (sortField === "locker") {
        const numA = a.locker?.numeroLocker || "";
        const numB = b.locker?.numeroLocker || "";
        return numA.localeCompare(numB, undefined, { numeric: true });
      }
      if (sortField === "ubicacion") {
        const locA = a.locker?.ubicacion?.pabellon || "";
        const locB = b.locker?.ubicacion?.pabellon || "";
        return locA.localeCompare(locB);
      }
      return 0;
    });
  }, [reservas, startDate, endDate, sortField]);

  // Definición de columnas
  const columns = [
    { id: "id", label: "ID", minWidth: 50 },
    { id: "locker", label: "N° Locker", minWidth: 100 },
    { id: "ubicacion", label: "Ubicación", minWidth: 150 },
    { id: "fechaInicio", label: "Desde", minWidth: 150 },
    { id: "fechaFin", label: "Hasta", minWidth: 150 },
    { id: "estado", label: "Estado", minWidth: 100 },
    { id: "acciones", label: "Acciones", minWidth: 80, align: "center" }, // Nueva columna
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

      {/* BARRA DE HERRAMIENTAS */}
      <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
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

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DateTimePicker
              label="Inicio desde"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { size: 'small', sx: { minWidth: 200 } } }}
            />
            <DateTimePicker
              label="Fin hasta"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ textField: { size: 'small', sx: { minWidth: 200 } } }}
            />
          </LocalizationProvider>

          {(startDate || endDate) && (
            <Typography
              variant="body2"
              sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline', fontWeight: 'bold' }}
              onClick={() => { setStartDate(null); setEndDate(null); }}
            >
              Limpiar
            </Typography>
          )}
        </Box>
      </Paper>

      {/* TABLA */}
      <TableContainer component={Paper} sx={{ maxHeight: 500, boxShadow: 3 }}>
        <Table stickyHeader aria-label="tabla mis lockers">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  sx={{
                    minWidth: column.minWidth,
                    fontWeight: "bold",
                    backgroundColor: "#212121",
                    color: "#fff",
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
                    <TableCell>{dayjs(row.fechaInicio).format("DD/MM/YYYY HH:mm")}</TableCell>
                    <TableCell>{dayjs(row.fechaFin).format("DD/MM/YYYY HH:mm")}</TableCell>
                    <TableCell>
                      <Chip label={row.estadoReserva} color="success" size="small" variant="filled" />
                    </TableCell>

                    {/* COLUMNA DE ACCIONES */}
                    <TableCell align="center">
                      <Tooltip title="Liberar y devolver locker">
                        <IconButton
                          color="error"
                          onClick={() => handleLiberarClick(row)}
                          sx={{ border: '1px solid', borderColor: 'error.main' }}
                        >
                          <LockOpenIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No tienes lockers activos para mostrar.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DIALOGO DE CONFIRMACIÓN */}
      <Dialog
        open={Boolean(selectedToLiberar)}
        onClose={() => setSelectedToLiberar(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Liberación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Ya terminaste de usar el <strong>Locker {selectedToLiberar?.locker?.numeroLocker}</strong>?
            <br /><br />
            Al confirmar, el locker quedará <strong>disponible</strong> para otros estudiantes y tu reserva se dará por finalizada.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedToLiberar(null)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmLiberar}
            variant="contained"
            color="error"
            autoFocus
            startIcon={<LockOpenIcon />}
          >
            Sí, Liberar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}