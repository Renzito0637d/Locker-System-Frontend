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
} from "@mui/material";
import { motion } from "framer-motion";

const bloques = ["A", "B", "C", "D", "E", "F"];
const numeros = Array.from({ length: 20 }, (_, i) =>
  (i + 1).toString().padStart(2, "0")
);

export default function ReportarIncidencia() {
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);
  const [numeroSeleccionado, setNumeroSeleccionado] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [description, setDescription] = useState("");
  const [incidencias, setIncidencias] = useState([]);

  // Cargar incidencias desde localStorage
  useEffect(() => {
    const savedIncidencias = JSON.parse(localStorage.getItem("incidencias")) || [];
    setIncidencias(savedIncidencias);
  }, []);

  // Guardar incidencias en localStorage
  useEffect(() => {
    localStorage.setItem("incidencias", JSON.stringify(incidencias));
  }, [incidencias]);

  // Enviar reporte
  const handleEnviarReporte = () => {
    if (!bloqueSeleccionado || !numeroSeleccionado || !selectedPart || !description) {
      alert("Por favor completa todos los campos antes de enviar el reporte.");
      return;
    }

    const nuevaIncidencia = {
      id: Date.now(),
      locker: `${bloqueSeleccionado}-${numeroSeleccionado}`,
      part: selectedPart,
      description,
      date: new Date().toLocaleString(),
    };

    setIncidencias([nuevaIncidencia, ...incidencias]);

    // limpiar inputs
    setBloqueSeleccionado(null);
    setNumeroSeleccionado(null);
    setSelectedPart(null);
    setDescription("");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Reportar Incidencia en Locker
      </Typography>

      {/* Selección de bloque */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Selecciona el bloque:
        </Typography>
        <Grid container spacing={1}>
          {bloques.map((bloque) => (
            <Grid item key={bloque}>
              <Button
                variant={bloqueSeleccionado === bloque ? "contained" : "outlined"}
                color="primary"
                onClick={() => setBloqueSeleccionado(bloque)}
              >
                {bloque}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Selección de número */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Selecciona el número:
        </Typography>
        <Grid container spacing={1}>
          {numeros.map((num) => (
            <Grid item key={num}>
              <Button
                variant={numeroSeleccionado === num ? "contained" : "outlined"}
                color="secondary"
                onClick={() => setNumeroSeleccionado(num)}
              >
                {num}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Imagen interactiva */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <img
          src="https://static.vecteezy.com/system/resources/previews/037/844/466/non_2x/locker-vecto-icon-vector.jpg"
          alt="Locker"
          style={{ width: "200px", borderRadius: "8px" }}
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/200x400.png?text=Locker";
          }}
        />

        {/* Partes seleccionables */}
        <motion.div
          whileHover={{ scale: 1.2 }}
          style={{
            position: "absolute",
            top: "40%",
            left: "51%",
            background: "#1976d2",
            borderRadius: "50%",
            width: "15px",
            height: "15px",
            cursor: "pointer",
          }}
          title="Puerta"
          onClick={() => setSelectedPart("Puerta")}
        />
        <motion.div
          whileHover={{ scale: 1.2 }}
          style={{
            position: "absolute",
            bottom: "50.7%",
            left: "48.7%",
            background: "#15ff00ff",
            borderRadius: "50%",
            width: "15px",
            height: "15px",
            cursor: "pointer",
          }}
          title="Cerradura"
          onClick={() => setSelectedPart("Cerradura")}
        />
        <motion.div
          whileHover={{ scale: 1.2 }}
          style={{
            position: "absolute",
            top: "28%",
            right: "52.5%",
            background: "#e53935",
            borderRadius: "50%",
            width: "15px",
            height: "15px",
            cursor: "pointer",
          }}
          title="Bisagra"
          onClick={() => setSelectedPart("Bisagra")}
        />
      </Box>

      {/* Descripción */}
      <TextField
        fullWidth
        label="Descripción del problema"
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Paper sx={{ p: 2 }}>
        <Typography>
          <strong>Locker seleccionado:</strong>{" "}
          {bloqueSeleccionado && numeroSeleccionado
            ? `${bloqueSeleccionado}-${numeroSeleccionado}`
            : "Ninguno"}
        </Typography>
        <Typography>
          <strong>Parte seleccionada:</strong>{" "}
          {selectedPart || "Ninguna"}
        </Typography>
        <Typography>
          <strong>Descripción:</strong> {description || "Sin descripción"}
        </Typography>
      </Paper>
      {/* Botón enviar */}
      <Button
        variant="contained"
        color="success"
        fullWidth
        onClick={handleEnviarReporte}
        sx={{ mb: 4 }}
      >
        Enviar Reporte
      </Button>

      <Divider sx={{ mb: 3 }} />

      {/* Incidencias reportadas */}
      <Typography variant="h6" gutterBottom>
        Incidencias reportadas
      </Typography>
      <Grid container spacing={2}>
        {incidencias.length === 0 ? (
          <Typography color="text.secondary" sx={{ ml: 2 }}>
            No hay incidencias registradas.
          </Typography>
        ) : (
          incidencias.map((inc) => (
            <Grid item xs={12} md={6} lg={4} key={inc.id}>
              <Card sx={{ bgcolor: "#1e1e2f", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">
                    Locker {inc.locker}
                  </Typography>
                  <Typography variant="body2" color="lightblue">
                    Parte: {inc.part}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {inc.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="gray"
                    sx={{ display: "block", mt: 1 }}
                  >
                    Fecha: {inc.date}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="error">
                    Eliminar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}
