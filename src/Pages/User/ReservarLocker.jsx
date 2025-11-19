import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
    Container,
    Typography,
    Button,
    MenuItem,
    Box,
    FormControl,
    InputLabel,
    Select,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Card,
    CardContent,
    CardActions,
    Chip,
    CircularProgress,
    Alert,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { getMe } from "../../lib/auth";
import { createReserva, deleteReserva, getLockers, getMisReservas } from "../../services/ReservaService";

const ReservarLocker = () => {
    // --- ESTADOS DE DATOS ---
    const [userId, setUserId] = useState(null);
    const [lockers, setLockers] = useState([]); // Todos los lockers traídos de BD
    const [reservas, setReservas] = useState([]); // Reservas del usuario

    // --- ESTADOS DEL FORMULARIO ---
    const [pabellon, setPabellon] = useState("");
    const [piso, setPiso] = useState("");
    const [selectedLockerId, setSelectedLockerId] = useState("");

    const [fecha, setFecha] = useState(dayjs());
    const [hora, setHora] = useState(dayjs());

    // --- ESTADOS DE UI ---
    const [loading, setLoading] = useState(true);
    const [openGuide, setOpenGuide] = useState(false);
    const [selectedToCancel, setSelectedToCancel] = useState(null); // ID reserva a cancelar
    const [errorMsg, setErrorMsg] = useState(null);

    // 1. CARGA INICIAL (Usuario, Lockers y Reservas)
    useEffect(() => {
        async function loadData() {
            try {
                // A. Obtener usuario actual
                const user = await getMe();
                setUserId(user.id);

                // B. Obtener Lockers
                const lockersData = await getLockers();
                setLockers(lockersData);

                // C. Obtener Reservas
                const reservasData = await getMisReservas();
                setReservas(reservasData);

            } catch (error) {
                console.error("Error cargando datos:", error);
                setErrorMsg("Error al cargar la información. Intenta recargar.");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Creamos una variable segura. Si lockers es null o no es array, usamos []
  const listaLockers = Array.isArray(lockers) ? lockers : [];

  // Usamos 'listaLockers' en lugar de 'lockers' para los cálculos:
  const pabellonesUnicos = [...new Set(listaLockers.map(l => l.ubicacion?.pabellon).filter(Boolean))].sort();
  
  const pisosDisponibles = [...new Set(
    listaLockers
      .filter(l => l.ubicacion?.pabellon === pabellon)
      .map(l => l.ubicacion?.piso)
  )].sort();

  const lockersFiltrados = listaLockers.filter(l => 
    l.ubicacion?.pabellon === pabellon && 
    l.ubicacion?.piso === piso &&
    l.estado === "DISPONIBLE" 
  );

    // 3. CREAR RESERVA
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!selectedLockerId || !fecha || !hora) {
            setErrorMsg("Por favor completa todos los campos.");
            return;
        }

        // Combinar fecha y hora para LocalDateTime
        // Ejemplo Java espera: "2023-10-20T14:30:00"
        const fechaInicio = fecha.hour(hora.hour()).minute(hora.minute()).second(0);

        // Definimos fecha fin (ejemplo: 2 horas después, o fin del día, según tu lógica)
        const fechaFin = fechaInicio.add(2, 'hour');

        const payload = {
            fechaInicio: fechaInicio.format("YYYY-MM-DDTHH:mm:ss"),
            fechaFin: fechaFin.format("YYYY-MM-DDTHH:mm:ss"),
            estadoReserva: "PENDIENTE",
            userId: userId,
            lockerId: selectedLockerId
        };

        try {
            await createReserva(payload);
            alert("¡Reserva exitosa!");
            // Recargar reservas
            const nuevasReservas = await getMisReservas();
            setReservas(nuevasReservas);
            // Resetear form parcial
            setSelectedLockerId("");
        } catch (error) {
            console.error(error);
            setErrorMsg("No se pudo crear la reserva.");
        }
    };

    // 4. CANCELAR RESERVA
    const handleConfirmCancel = async () => {
        if (!selectedToCancel) return;
        try {
            await deleteReserva(selectedToCancel);
            setReservas(reservas.filter(r => r.id !== selectedToCancel));
            setSelectedToCancel(null);
        } catch (error) {
            console.error(error);
            alert("Error al cancelar");
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;

    // Helper para mostrar info en el modal de cancelar
    const reservaSeleccionada = reservas.find(r => r.id === selectedToCancel);

    return (
        <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
            <Typography variant="h5" gutterBottom>
                Reservar Locker
            </Typography>

            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

            {/* FORMULARIO */}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                {/* 1. SELECT PABELLÓN */}
                <FormControl fullWidth required>
                    <InputLabel>Pabellón</InputLabel>
                    <Select
                        value={pabellon}
                        label="Pabellón"
                        onChange={(e) => {
                            setPabellon(e.target.value);
                            setPiso(""); // Reset siguiente
                            setSelectedLockerId(""); // Reset siguiente
                        }}
                    >
                        {pabellonesUnicos.map((p) => (
                            <MenuItem key={p} value={p}>Pabellón {p}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* 2. SELECT PISO (Solo aparece si hay pabellón) */}
                <FormControl fullWidth required disabled={!pabellon}>
                    <InputLabel>Piso</InputLabel>
                    <Select
                        value={piso}
                        label="Piso"
                        onChange={(e) => {
                            setPiso(e.target.value);
                            setSelectedLockerId("");
                        }}
                    >
                        {pisosDisponibles.map((p) => (
                            <MenuItem key={p} value={p}>{p}° Piso</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* 3. SELECT LOCKER (Número) */}
                <FormControl fullWidth required disabled={!piso}>
                    <InputLabel>Número de Locker</InputLabel>
                    <Select
                        value={selectedLockerId}
                        label="Número de Locker"
                        onChange={(e) => setSelectedLockerId(e.target.value)}
                    >
                        {lockersFiltrados.map((l) => (
                            <MenuItem key={l.id} value={l.id}>
                                Locker {l.numeroLocker}
                            </MenuItem>
                        ))}
                        {lockersFiltrados.length === 0 && piso && (
                            <MenuItem disabled>No hay lockers disponibles</MenuItem>
                        )}
                    </Select>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Fecha"
                        value={fecha}
                        onChange={(newValue) => setFecha(newValue)}
                        disablePast
                        format="DD/MM/YYYY"
                        slotProps={{ textField: { required: true } }}
                    />
                    <TimePicker
                        label="Hora de Inicio"
                        value={hora}
                        onChange={(newValue) => setHora(newValue)}
                        slotProps={{ textField: { required: true } }}
                    />
                </LocalizationProvider>

                <Button variant="outlined" onClick={() => setOpenGuide(true)}>
                    Ver distribución de lockers
                </Button>

                {/* MODAL GUIA (Tu código original) */}
                <Dialog open={openGuide} onClose={() => setOpenGuide(false)} maxWidth="md" fullWidth >
                    <DialogTitle>Distribución de lockers</DialogTitle>
                    <DialogContent dividers>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            {/* Placeholder para la imagen */}
                            <img src="https://via.placeholder.com/600x300?text=Mapa+Lockers" alt="Mapa" style={{ maxWidth: "100%", borderRadius: 8 }} />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenGuide(false)}>Cerrar</Button>
                    </DialogActions>
                </Dialog>

                <Button type="submit" variant="contained" color="primary" size="large">
                    Confirmar Reserva
                </Button>
            </Box>

            {/* LISTA DE RESERVAS */}
            <Box sx={{ mt: 5 }}>
                <Typography variant="h6" gutterBottom>
                    Mis Lockers Reservados
                </Typography>

                {reservas.length === 0 ? (
                    <Typography color="text.secondary">No tienes lockers reservados aún.</Typography>
                ) : (
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 2, mt: 2 }}>
                        {reservas.map((reserva) => (
                            <Card key={reserva.id} sx={{ borderRadius: 2, boxShadow: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" color="primary">
                                        {/* Accedemos a los datos anidados del objeto ReservaResponse */}
                                        Locker {reserva.locker?.numeroLocker || "?"}
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {reserva.locker?.ubicacion?.pabellon} - Piso {reserva.locker?.ubicacion?.piso}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                        📅 {dayjs(reserva.fechaInicio).format("DD/MM/YYYY")}
                                        <br />
                                        ⏰ {dayjs(reserva.fechaInicio).format("HH:mm")} - {dayjs(reserva.fechaFin).format("HH:mm")}
                                    </Typography>
                                    <Chip
                                        label={reserva.estadoReserva || "ACTIVA"}
                                        color={reserva.estadoReserva === "CANCELADA" ? "error" : "success"}
                                        size="small"
                                        sx={{ mt: 1 }}
                                    />
                                </CardContent>
                                <CardActions>
                                    {/* Solo permitir cancelar si no está cancelada ya */}
                                    {reserva.estadoReserva !== "CANCELADA" && (
                                        <Button size="small" color="error" onClick={() => setSelectedToCancel(reserva.id)}>
                                            Cancelar
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        ))}
                    </Box>
                )}
            </Box>

            {/* DIALOGO DE CONFIRMACIÓN */}
            <Dialog open={selectedToCancel !== null} onClose={() => setSelectedToCancel(null)} maxWidth="xs" fullWidth>
                <DialogTitle>Confirmar cancelación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {reservaSeleccionada ? (
                            <>
                                ¿Estás seguro que deseas cancelar la reserva del locker{" "}
                                <strong>{reservaSeleccionada.locker?.numeroLocker}</strong>?
                            </>
                        ) : "Cancelar reserva?"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedToCancel(null)}>No, regresar</Button>
                    <Button color="error" onClick={handleConfirmCancel}>Sí, cancelar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ReservarLocker;
