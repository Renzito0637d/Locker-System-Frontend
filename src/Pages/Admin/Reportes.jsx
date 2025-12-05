import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BuildIcon from '@mui/icons-material/Build'; // Icono de herramienta
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import dayjs from "dayjs";
import { getAllReportes, updateReporte, deleteReporte } from "../../services/ReporteService";

// Asegúrate de que la ruta coincida con tu estructura

export default function ReportesAdmin() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS PARA DIÁLOGOS ---
  // 1. Mantenimiento (Editar/Atender)
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentReporte, setCurrentReporte] = useState(null);
  const [acciones, setAcciones] = useState("");
  const [estado, setEstado] = useState("");

  // 2. Confirmación de Eliminación
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [reporteToDelete, setReporteToDelete] = useState(null);

  // 3. Alertas (Éxito/Error)
  const [alertConfig, setAlertConfig] = useState({ open: false, title: "", message: "", type: "info" });

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllReportes();
      const sorted = data.sort((a, b) => new Date(b.fechaReporte) - new Date(a.fechaReporte));
      setReportes(sorted);
    } catch (error) {
      console.error("Error cargando reportes:", error);
    } finally {
      setLoading(false);
    }
  }, []); // Array vacío porque no depende de variables externas

  // 3. USAR la función DESPUÉS en el useEffect
  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // --- HELPERS PARA ALERTAS ---
  const showAlert = (title, message, type = "info") => {
    setAlertConfig({ open: true, title, message, type });
  };

  const closeAlert = () => {
    setAlertConfig({ ...alertConfig, open: false });
  };

  // --- MANTENIMIENTO (ATENDER) ---
  const handleEditClick = (reporte) => {
    setCurrentReporte(reporte);
    setAcciones(reporte.accionesTomadas || "");
    setEstado(reporte.estado || "PENDIENTE");
    setOpenEditDialog(true);
  };

  const handleSave = async () => {
    if (!currentReporte) return;

    try {
      const payload = {
        descripcion: currentReporte.descripcion,
        tipoReporte: currentReporte.tipoReporte,
        accionesTomadas: acciones,
        estado: estado
      };

      await updateReporte(currentReporte.id, payload);

      setReportes((prev) =>
        prev.map((r) => r.id === currentReporte.id
          ? { ...r, accionesTomadas: acciones, estado: estado }
          : r
        )
      );

      setOpenEditDialog(false);
      showAlert("Éxito", "Reporte actualizado correctamente.");
    } catch (error) {
      console.error("Error actualizando reporte:", error);
      showAlert("Error", "No se pudo guardar los cambios.", "error");
    }
  };

  // --- ELIMINAR ---
  const handleDeleteClick = (reporte) => {
    setReporteToDelete(reporte);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!reporteToDelete) return;
    try {
      await deleteReporte(reporteToDelete.id);
      setReportes((prev) => prev.filter((r) => r.id !== reporteToDelete.id));
      setOpenDeleteDialog(false);
      showAlert("Eliminado", "El reporte ha sido eliminado.");
    } catch (error) {
      console.error(error);
      showAlert("Error", "No se pudo eliminar el reporte.", "error");
    }
  };

  // Helper para colores de estado
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDIENTE": return "warning";
      case "EN_PROCESO": return "info";
      case "RESUELTO": return "success"; // O "RESUELTO" según tu Enum
      default: return "default";
    }
  };

  if (loading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Gestión de Incidencias y Reportes
      </Typography>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Locker</TableCell>
              <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Reportado Por</TableCell>
              <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Tipo / Problema</TableCell>
              <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Fecha</TableCell>
              <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportes.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {row.locker?.numeroLocker || "-"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.locker?.ubicacion?.pabellon ? `${row.locker.ubicacion.pabellon} - ${row.locker.ubicacion.piso}` : ""}
                  </Typography>
                </TableCell>
                <TableCell>
                  {row.user?.userName || "-"}
                  <br />
                  <Typography variant="caption" color="text.secondary">{row.user?.email}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.tipoReporte}
                    size="small"
                    variant="outlined"
                    sx={{ mb: 0.5, mr: 1 }}
                  />
                  <Typography variant="body2" component="span" sx={{ fontStyle: 'italic' }}>
                    {row.descripcion?.substring(0, 30)}{row.descripcion?.length > 30 ? "..." : ""}
                  </Typography>
                </TableCell>
                <TableCell>
                  {dayjs(row.fechaReporte).format("DD/MM/YYYY")}
                  <br />
                  <small>{dayjs(row.fechaReporte).format("HH:mm")}</small>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.estado}
                    color={getStatusColor(row.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Atender / Ver Detalles">
                    <IconButton color="primary" onClick={() => handleEditClick(row)}>
                      <BuildIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton color="error" onClick={() => handleDeleteClick(row)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {reportes.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>No hay reportes registrados.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- DIALOGO DE MANTENIMIENTO (ATENDER) --- */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          Atender Reporte #{currentReporte?.id}
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Info Original */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Usuario</Typography>
              <Typography variant="body1" gutterBottom>{currentReporte?.user?.userName} ({currentReporte?.user?.email})</Typography>

              <Divider sx={{ my: 1 }} />

              <Typography variant="subtitle2" color="text.secondary">Locker Afectado</Typography>
              <Typography variant="body1" gutterBottom>
                <strong>N° {currentReporte?.locker?.numeroLocker}</strong>
                {' '}({currentReporte?.locker?.ubicacion?.pabellon} - Piso {currentReporte?.locker?.ubicacion?.piso})
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Typography variant="subtitle2" color="text.secondary">Problema Reportado</Typography>
              <Typography variant="body1" gutterBottom color="error">
                {currentReporte?.tipoReporte}
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'background.paper' }}>
                <Typography variant="body2" style={{ fontStyle: 'italic' }}>
                  "{currentReporte?.descripcion}"
                </Typography>
              </Paper>
            </Grid>

            {/* Formulario Admin */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                Resolución
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Estado del Reporte</InputLabel>
                <Select
                  value={estado}
                  label="Estado del Reporte"
                  onChange={(e) => setEstado(e.target.value)}
                >
                  <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
                  <MenuItem value="EN_PROCESO">EN_PROCESO</MenuItem>
                  <MenuItem value="RESUELTO">RESUELTO</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Acciones Tomadas / Notas Técnicas"
                multiline
                rows={6}
                fullWidth
                variant="outlined"
                value={acciones}
                onChange={(e) => setAcciones(e.target.value)}
                placeholder="Describe la solución aplicada..."
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenEditDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary" startIcon={<BuildIcon />}>
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- DIALOGO DE CONFIRMACIÓN DE ELIMINACIÓN --- */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon color="error" />
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas eliminar el reporte del Locker <strong>{reporteToDelete?.locker?.numeroLocker}</strong>?
            <br />
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">Cancelar</Button>
          <Button onClick={confirmDelete} variant="contained" color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- DIALOGO DE ALERTAS GENERALES --- */}
      <Dialog
        open={alertConfig.open}
        onClose={closeAlert}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon color={alertConfig.type === 'error' ? 'error' : 'info'} />
          {alertConfig.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {alertConfig.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAlert} color="primary" autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}