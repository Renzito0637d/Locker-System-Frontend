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
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const bloques = ["A", "B", "C", "D", "E", "F"];
const numeros = Array.from({ length: 20 }, (_, i) =>
  (i + 1).toString().padStart(2, "0")
);

export default function ReportarIncidencia() {
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);
  const [numeroSeleccionado, setNumeroSeleccionado] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

  // Inicializar incidencias desde localStorage (lazy initializer)
  const [incidencias, setIncidencias] = useState(() => {
    try {
      const saved = localStorage.getItem("incidencias");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error leyendo localStorage:", e);
      return [];
    }
  });

  // Guardar incidencias en localStorage cuando cambian
  useEffect(() => {
    try {
      localStorage.setItem("incidencias", JSON.stringify(incidencias));
    } catch (e) {
      console.error("Error guardando en localStorage:", e);
    }
  }, [incidencias]);

  // Limpiar formulario
  const resetForm = () => {
    setBloqueSeleccionado(null);
    setNumeroSeleccionado(null);
    setSelectedPart(null);
    setDescription("");
    setEditId(null);
  };

  // Enviar/Guardar reporte (crear o actualizar)
  const handleEnviarReporte = () => {
    if (!bloqueSeleccionado || !numeroSeleccionado || !selectedPart || !description) {
      alert("Por favor completa todos los campos antes de enviar el reporte.");
      return;
    }

    if (editId !== null) {
      // Actualizar incidencia existente
      setIncidencias((prev) =>
        prev.map((inc) =>
          inc.id === editId
            ? {
              ...inc,
              locker: `${bloqueSeleccionado}-${numeroSeleccionado}`,
              part: selectedPart,
              description,
              date: new Date().toLocaleString(),
            }
            : inc
        )
      );
      resetForm();
      return;
    }

    // Crear nueva incidencia
    const nuevaIncidencia = {
      id: Date.now(),
      locker: `${bloqueSeleccionado}-${numeroSeleccionado}`,
      part: selectedPart,
      description,
      date: new Date().toLocaleString(),
    };

    setIncidencias((prev) => [nuevaIncidencia, ...prev]);
    resetForm();
  };

  // Eliminar incidencia
  const handleDelete = (id) => {
    const ok = window.confirm("¿Eliminar esta incidencia? Esta acción no se puede deshacer.");
    if (!ok) return;
    setIncidencias((prev) => prev.filter((inc) => inc.id !== id));
    // si estamos editando la misma incidencia, limpiar form
    if (editId === id) resetForm();
  };

  // Editar incidencia (cargar en formulario)
  const handleEdit = (id) => {
    const inc = incidencias.find((i) => i.id === id);
    if (!inc) return;
    const [bloque, numero] = inc.locker.split("-");
    setBloqueSeleccionado(bloque || null);
    setNumeroSeleccionado(numero || null);
    setSelectedPart(inc.part || null);
    setDescription(inc.description || "");
    setEditId(inc.id);
    // scroll opcional al form (si quieres)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Borrar todas (opcional)
  const handleClearAll = () => {
    const ok = window.confirm("¿Borrar todas las incidencias guardadas?");
    if (!ok) return;
    setIncidencias([]);
    resetForm();
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
            e.target.src = "https://via.placeholder.com/200x400.png?text=Locker";
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
        sx={{ mb: 2 }}
      />
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography>
          <strong>Locker seleccionado:</strong>{" "}
          {bloqueSeleccionado && numeroSeleccionado
            ? `${bloqueSeleccionado}-${numeroSeleccionado}`
            : "Ninguno"}
        </Typography>
        <Typography>
          <strong>Parte seleccionada:</strong> {selectedPart || "Ninguna"}
        </Typography>
        <Typography>
          <strong>Descripción:</strong> {description || "Sin descripción"}
        </Typography>
      </Paper>

      {/* Botones enviar / cancelar / borrar todo */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleEnviarReporte}
          >
            {editId ? "Actualizar Reporte" : "Enviar Reporte"}
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button variant="outlined" fullWidth onClick={resetForm}>
            Cancelar
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button variant="outlined" color="error" fullWidth onClick={handleClearAll}>
            Borrar todas
          </Button>
        </Grid>
      </Grid>

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
                  <Typography variant="h6">Locker {inc.locker}</Typography>
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
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEdit(inc.id)}
                    title="Editar"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(inc.id)}
                    title="Eliminar"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}
