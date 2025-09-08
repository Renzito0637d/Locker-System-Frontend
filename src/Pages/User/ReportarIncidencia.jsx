// src/Pages/User/ReportarIncidencia.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

export default function ReportarIncidencia() {
  const [lockerNumber, setLockerNumber] = useState("");
  const [selectedPart, setSelectedPart] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!lockerNumber) {
      alert("Por favor ingresa el número de locker.");
      return;
    }
    if (!selectedPart) {
      alert("Por favor selecciona la parte del locker que presenta falla.");
      return;
    }

    const reporte = {
      id: Date.now(),
      locker: lockerNumber,
      usuario: "Anónimo",
      descripcion: description,
      parte: selectedPart,
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      estado: "pendiente",
    };

    console.log("Reporte enviado:", reporte);

    setLockerNumber("");
    setSelectedPart("");
    setDescription("");

    alert("✅ Tu reporte fue enviado correctamente");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0D1117",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 600,
          bgcolor: "#161B22",
          borderRadius: 3,
          boxShadow: 5,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            align="center"
            sx={{ color: "#58a6ff", fontWeight: "bold", mb: 3 }}
          >
            Reportar Incidencia de Locker
          </Typography>

          <TextField
            fullWidth
            label="Número de Locker"
            type="number"
            variant="outlined"
            value={lockerNumber}
            onChange={(e) => setLockerNumber(e.target.value)}
            sx={{
              mb: 3,
              input: { color: "white" },
              label: { color: "gray" },
            }}
          />

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
                left: "55%",
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
                left: "43.7%",
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
                right: "62%",
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

          {selectedPart && (
            <Typography align="center" sx={{ mb: 2, color: "#8b949e" }}>
              Parte seleccionada:{" "}
              <span style={{ color: "#58a6ff", fontWeight: "bold" }}>
                {selectedPart}
              </span>
            </Typography>
          )}

          <TextField
            fullWidth
            label="Descripción del problema"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              mb: 3,
              textarea: { color: "white" },
              label: { color: "gray" },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ bgcolor: "#1976d2", "&:hover": { bgcolor: "#2196f3" } }}
            onClick={handleSubmit}
          >
            Enviar Reporte
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
