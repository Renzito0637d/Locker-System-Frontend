import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const ReservarLocker = () => {
  const [formData, setFormData] = useState({
    ubicacion: "",
    bloque: "",
    numero: "",
    fecha: null,
    hora: null,
  });

  const [open, setOpen] = useState(false);

  const bloques = ["A", "B", "C", "D", "E", "F"];
  const numeros = Array.from({ length: 20 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reserva realizada:", {
      ...formData,
      fecha: formData.fecha ? formData.fecha.format("YYYY-MM-DD") : null,
      hora: formData.hora ? formData.hora.format("HH:mm") : null,
    });
    // Aquí podrías llamar a tu backend con fetch o axios
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Reservar Locker
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >

        {/* 🏢 Selección de bloque */}
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

        {/* 🔢 Selección de número */}
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

        {/* 📅 Selector de fecha */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Fecha"
            value={formData.fecha}
            onChange={(newValue) => {
              setFormData({ ...formData, fecha: newValue });
            }}
            disablePast // ⛔ No permite días anteriores
            format="DD/MM/YYYY"
            slotProps={{ textField: { required: true } }}
          />

          {/* ⏰ Selector de hora */}
          <TimePicker
            label="Hora"
            value={formData.hora}
            onChange={(newValue) => {
              setFormData({ ...formData, hora: newValue });
            }}
            slotProps={{ textField: { required: true } }}
          />
        </LocalizationProvider>

        {/* Botón para abrir modal */}
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Ver distribución de lockers
        </Button>

        {/* Modal con imagen guía */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Distribución de lockers</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img
                src="/images/guia-lockers.png" // 📌 coloca tu imagen en public/images/
                alt="Distribución de lockers"
                style={{ maxWidth: "100%", borderRadius: "8px" }}
              />
            </Box>
          </DialogContent>
        </Dialog>

        {/* Botón de submit */}
        <Button type="submit" variant="contained" color="primary">
          Reservar
        </Button>
      </Box>
    </Container>
  );
};

export default ReservarLocker;
