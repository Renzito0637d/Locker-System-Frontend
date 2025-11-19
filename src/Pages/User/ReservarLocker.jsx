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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const STORAGE_KEYS = {
  RESERVAS: "reservasLockers_v1",
  DRAFT: "reservasLockers_draft_v1",
};

const ReservarLocker = () => {
  const bloques = ["A", "B", "C", "D", "E", "F"];
  const numeros = Array.from({ length: 20 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const [formData, setFormData] = useState({
    bloque: "",
    numero: "",
    fecha: null,
    hora: null,
  });

  const [openGuide, setOpenGuide] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [selectedToCancel, setSelectedToCancel] = useState(null);

  // === cargar datos al montar ===
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RESERVAS);
      if (stored) {
        setReservas(JSON.parse(stored));
      }

      const draft = localStorage.getItem(STORAGE_KEYS.DRAFT);
      if (draft) {
        const pd = JSON.parse(draft);
        setFormData({
          bloque: pd.bloque || "",
          numero: pd.numero || "",
          fecha: pd.fecha ? dayjs(pd.fecha) : null,
          hora: pd.hora ? dayjs(pd.hora, "HH:mm") : null,
        });
      }
    } catch (e) {
      console.error("Error al leer localStorage:", e);
    }
  }, []);

  // === guardar reservas ===
  const saveReservas = (newReservas) => {
    setReservas(newReservas);
    localStorage.setItem(STORAGE_KEYS.RESERVAS, JSON.stringify(newReservas));
  };

  // === guardar draft (cuando el usuario cambia algo) ===
  useEffect(() => {
    if (!formData.bloque && !formData.numero && !formData.fecha && !formData.hora) {
      return; // no guardamos si está vacío
    }

    const draftToStore = {
      bloque: formData.bloque,
      numero: formData.numero,
      fecha: formData.fecha ? formData.fecha.format("YYYY-MM-DD") : null,
      hora: formData.hora ? formData.hora.format("HH:mm") : null,
    };

    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draftToStore));
  }, [formData]);

  // === handlers ===
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.bloque || !formData.numero || !formData.fecha || !formData.hora) {
      alert("Completa bloque, número, fecha y hora.");
      return;
    }

    const nuevaReserva = {
      id: reservas.length > 0 ? Math.max(...reservas.map((r) => r.id)) + 1 : 1,
      bloque: formData.bloque,
      numero: formData.numero,
      fecha: formData.fecha.format("YYYY-MM-DD"),
      hora: formData.hora.format("HH:mm"),
      estado: "Activo",
    };

    const updated = [...reservas, nuevaReserva];
    saveReservas(updated);

    // limpiar formulario y draft
    setFormData({ bloque: "", numero: "", fecha: null, hora: null });
    localStorage.removeItem(STORAGE_KEYS.DRAFT);

    console.log("Reserva realizada:", nuevaReserva);
  };

  const handleCancelClick = (id) => {
    setSelectedToCancel(id);
  };

  const handleConfirmCancel = () => {
    if (selectedToCancel == null) return;
    const updated = reservas.filter((r) => r.id !== selectedToCancel);
    saveReservas(updated);
    setSelectedToCancel(null);
  };

  const handleCloseCancel = () => {
    setSelectedToCancel(null);
  };

  const reservaSeleccionada = reservas.find((r) => r.id === selectedToCancel);

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Reservar Locker
      </Typography>

      {/* FORMULARIO */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <FormControl fullWidth>
          <InputLabel id="bloque-label">Bloque</InputLabel>
          <Select
            labelId="bloque-label"
            name="bloque"
            value={formData.bloque}
            onChange={handleChange}
            required
          >
            {bloques.map((b) => (
              <MenuItem key={b} value={b}>
                {`Bloque ${b}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="numero-label">Número</InputLabel>
          <Select
            labelId="numero-label"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            required
          >
            {numeros.map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Fecha"
            value={formData.fecha}
            onChange={(newValue) => {
              setFormData((prev) => ({ ...prev, fecha: newValue }));
            }}
            disablePast
            format="DD/MM/YYYY"
          />
          <TimePicker
            label="Hora"
            value={formData.hora}
            onChange={(newValue) => {
              setFormData((prev) => ({ ...prev, hora: newValue }));
            }}
          />
        </LocalizationProvider>
        {/* Guía (modal informativo) */}
        <Button variant="outlined" onClick={() => setOpenGuide(true)}>
          Ver distribución de lockers
        </Button>
        <Dialog open={openGuide} onClose={() => setOpenGuide(false)} maxWidth="md" fullWidth >
          <DialogTitle>
            Distribución de lockers
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img src="/images/guia-lockers.png" alt="Distribución de lockers" style={{ maxWidth: "100%", borderRadius: 8 }} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenGuide(false)}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
        <Button type="submit" variant="contained" color="primary">
          Reservar
        </Button>
      </Box>

      {/* LISTA DE RESERVAS */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          Mis Lockers Reservados
        </Typography>

        {reservas.length === 0 ? (
          <Typography color="text.secondary">
            No tienes lockers reservados aún.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 2,
              mt: 2,
            }}
          >
            {reservas.map((reserva) => (
              <Card key={reserva.id} sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Locker {reserva.bloque}-{reserva.numero}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📅 {reserva.fecha} ⏰ {reserva.hora}
                  </Typography>
                  <Chip
                    label={reserva.estado}
                    color={reserva.estado === "Activo" ? "success" : "error"}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleCancelClick(reserva.id)}
                  >
                    Cancelar
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* CONFIRMAR CANCELACIÓN */}
      <Dialog
        open={selectedToCancel !== null}
        onClose={handleCloseCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar cancelación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {reservaSeleccionada ? (
              <>
                ¿Estás seguro que deseas cancelar la reserva del locker{" "}
                <strong>
                  {reservaSeleccionada.bloque}-{reservaSeleccionada.numero}
                </strong>{" "}
                programada para <strong>{reservaSeleccionada.fecha}</strong> a
                las <strong>{reservaSeleccionada.hora}</strong>?
              </>
            ) : (
              "¿Estás seguro que deseas cancelar esta reserva?"
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancel}>No, regresar</Button>
          <Button color="error" onClick={handleConfirmCancel}>
            Sí, cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReservarLocker;
