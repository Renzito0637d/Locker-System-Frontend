import React, { useState } from "react";
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

  // reservas de ejemplo (luego remplazarás por datos reales desde el backend)
  const [reservas, setReservas] = useState([
    {
      id: 1,
      bloque: "A",
      numero: "05",
      fecha: "2025-09-10",
      hora: "14:00",
      estado: "Activo",
    },
    {
      id: 2,
      bloque: "C",
      numero: "12",
      fecha: "2025-09-05",
      hora: "09:30",
      estado: "Expirado",
    },
  ]);

  // id de la reserva seleccionada para cancelar (null = modal cerrado)
  const [selectedToCancel, setSelectedToCancel] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevaReserva = {
      id: reservas.length > 0 ? Math.max(...reservas.map(r => r.id)) + 1 : 1,
      bloque: formData.bloque,
      numero: formData.numero,
      fecha: formData.fecha ? formData.fecha.format("YYYY-MM-DD") : null,
      hora: formData.hora ? formData.hora.format("HH:mm") : null,
      estado: "Activo",
    };
    setReservas([...reservas, nuevaReserva]);
    console.log("Reserva realizada:", nuevaReserva);
    // opcional: limpiar formulario
    setFormData({ bloque: "", numero: "", fecha: null, hora: null });
  };

  // abrir modal de confirmación indicando la reserva a cancelar
  const handleCancelClick = (id) => {
    setSelectedToCancel(id);
  };

  // confirmar cancelación: eliminar la reserva seleccionada
  const handleConfirmCancel = () => {
    if (selectedToCancel == null) return;
    setReservas((prev) => prev.filter((r) => r.id !== selectedToCancel));
    setSelectedToCancel(null);
  };

  const handleCloseCancel = () => {
    setSelectedToCancel(null);
  };

  // buscar datos de la reserva seleccionada para mostrar en el dialog
  const reservaSeleccionada = reservas.find((r) => r.id === selectedToCancel);

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Reservar Locker
      </Typography>

      {/* FORMULARIO DE RESERVA */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Bloque */}
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

        {/* Número */}
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

        {/* Fecha y hora */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Fecha"
            value={formData.fecha}
            onChange={(newValue) => {
              setFormData({ ...formData, fecha: newValue });
            }}
            disablePast
            format="DD/MM/YYYY"
            slotProps={{ textField: { required: true } }}
          />
          <TimePicker
            label="Hora"
            value={formData.hora}
            onChange={(newValue) => {
              setFormData({ ...formData, hora: newValue });
            }}
            slotProps={{ textField: { required: true } }}
          />
        </LocalizationProvider>

        {/* Guía (modal informativo) */}
        <Button variant="outlined" onClick={() => setOpenGuide(true)}>
          Ver distribución de lockers
        </Button>

        <Dialog
          open={openGuide}
          onClose={() => setOpenGuide(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Distribución de lockers</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img
                src="/images/guia-lockers.png"
                alt="Distribución de lockers"
                style={{ maxWidth: "100%", borderRadius: 8 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenGuide(false)}>Cerrar</Button>
          </DialogActions>
        </Dialog>

        {/* Submit */}
        <Button type="submit" variant="contained" color="primary">
          Reservar
        </Button>
      </Box>

      {/* SECCIÓN DE LOCKERS RESERVADOS (cards) */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          Mis Lockers Reservados
        </Typography>

        {reservas.length === 0 ? (
          <Typography color="text.secondary">No tienes lockers reservados aún.</Typography>
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

      {/* DIALOGO DE CONFIRMACIÓN DE CANCELACIÓN */}
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
                programada para <strong>{reservaSeleccionada.fecha}</strong> a las{" "}
                <strong>{reservaSeleccionada.hora}</strong>?
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
