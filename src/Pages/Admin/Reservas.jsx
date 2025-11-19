import React, { useEffect, useState } from "react";
import {
    Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, Chip, IconButton, Tooltip, CircularProgress,
    DialogTitle,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import dayjs from "dayjs";
import { getAllReservas, updateReserva } from "../../services/ReservaService";

export default function Reservas() {

    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- ESTADOS PARA EL DIALOGO DE CONFIRMACIÓN ---
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState({
        reserva: null,
        nuevoEstado: null
    });
    // -----------------------------------------------

    useEffect(() => {
        cargarReservas();
    }, []);

    const cargarReservas = async () => {
        setLoading(true);
        try {
            const data = await getAllReservas();
            // Ordenar: PENDIENTE primero
            const ordenadas = data.sort((a, b) => {
                if (a.estadoReserva === "PENDIENTE" && b.estadoReserva !== "PENDIENTE") return -1;
                if (a.estadoReserva !== "PENDIENTE" && b.estadoReserva === "PENDIENTE") return 1;
                return new Date(b.fechaInicio) - new Date(a.fechaInicio);
            });
            setReservas(ordenadas);
        } catch (error) {
            console.error("Error cargando reservas:", error);
        } finally {
            setLoading(false);
        }
    };

    // 1. ABRIR EL DIÁLOGO
    const handleOpenConfirm = (reserva, nuevoEstado) => {
        setSelectedAction({ reserva, nuevoEstado });
        setDialogOpen(true);
    };

    // 2. CERRAR EL DIÁLOGO
    const handleCloseConfirm = () => {
        setDialogOpen(false);
        setSelectedAction({ reserva: null, nuevoEstado: null });
    };

    // 3. EJECUTAR LA ACCIÓN (Cuando le dan a "Confirmar" en el Dialog)
    const handleExecuteAction = async () => {
        const { reserva, nuevoEstado } = selectedAction;
        if (!reserva || !nuevoEstado) return;

        try {
            const payload = {
                fechaInicio: reserva.fechaInicio,
                fechaFin: reserva.fechaFin,
                estadoReserva: nuevoEstado,
                userId: reserva.user?.id,
                lockerId: reserva.locker?.id
            };

            await updateReserva(reserva.id, payload);

            // Actualizar tabla local
            setReservas((prev) =>
                prev.map((r) => (r.id === reserva.id ? { ...r, estadoReserva: nuevoEstado } : r))
            );

            // Cerrar diálogo
            handleCloseConfirm();

        } catch (error) {
            console.error("Error actualizando:", error);
            alert("Error al actualizar. Revisa la consola."); // Fallback por si falla la red
        }
    };

    const getStatusColor = (status) => {
        const s = status ? status.toUpperCase() : "";
        switch (s) {
            case "APROBADA": return "success";
            case "PENDIENTE": return "warning";
            case "RECHAZADA": return "error";
            default: return "default";
        }
    };

    if (loading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;

    // Determinar textos y colores para el diálogo dinámicamente
    const isApprove = selectedAction.nuevoEstado === "APROBADA";
    const dialogTitle = isApprove ? "Aprobar Reserva" : "Rechazar Reserva";
    const dialogColor = isApprove ? "success" : "error";

    return (
        <Box >
            <Typography variant="h4" gutterBottom >
                Gestión de Solicitudes
            </Typography>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead >
                        <TableRow>
                            <TableCell sx={{ color: "white" }}>ID</TableCell>
                            <TableCell sx={{ color: "white" }}>Estudiante</TableCell>
                            <TableCell sx={{ color: "white" }}>Locker</TableCell>
                            <TableCell sx={{ color: "white" }}>Fechas</TableCell>
                            <TableCell sx={{ color: "white" }}>Estado</TableCell>
                            <TableCell sx={{ color: "white" }} align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservas.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold">{row.user?.userName}</Typography>
                                    <Typography variant="caption" color="text.secondary">{row.user?.email}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">Locker <strong>{row.locker?.numeroLocker}</strong></Typography>
                                    <Typography variant="caption">{row.locker?.ubicacion?.pabellon} - {row.locker?.ubicacion?.piso}° Piso</Typography>
                                </TableCell>
                                <TableCell>
                                    {dayjs(row.fechaInicio).format("DD/MM/YYYY")} <br />
                                    <small>{dayjs(row.fechaInicio).format("HH:mm")} - {dayjs(row.fechaFin).format("HH:mm")}</small>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={row.estadoReserva}
                                        color={getStatusColor(row.estadoReserva)}
                                        size="small"
                                        variant={row.estadoReserva === "PENDIENTE" ? "filled" : "outlined"}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    {row.estadoReserva === "PENDIENTE" ? (
                                        <Box display="flex" gap={1} justifyContent="center">
                                            <Tooltip title="Aprobar">
                                                <IconButton
                                                    color="success"
                                                    onClick={() => handleOpenConfirm(row, "APROBADA")} // AHORA LLAMA AL DIALOGO
                                                    sx={{ border: '1px solid green' }}
                                                >
                                                    <CheckCircleIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Rechazar">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleOpenConfirm(row, "RECHAZADA")} // AHORA LLAMA AL DIALOGO
                                                    sx={{ border: '1px solid red' }}
                                                >
                                                    <CancelIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">Procesado</Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {reservas.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No hay reservas registradas.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* --- DIALOGO DE CONFIRMACIÓN MUI --- */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseConfirm}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningAmberIcon color={dialogColor} />
                    {dialogTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro que deseas <strong>{isApprove ? "APROBAR" : "RECHAZAR"}</strong> la reserva del Locker
                        {' '}<strong>{selectedAction.reserva?.locker?.numeroLocker}</strong> para el estudiante
                        {' '}<strong>{selectedAction.reserva?.user?.userName}</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirm} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleExecuteAction}
                        variant="contained"
                        color={dialogColor}
                        autoFocus
                    >
                        Confirmar {isApprove ? "Aprobación" : "Rechazo"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}