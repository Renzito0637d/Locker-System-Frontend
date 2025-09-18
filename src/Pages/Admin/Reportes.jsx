import * as React from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Container,
  IconButton,
  Stack,
  Button,
} from "@mui/material";

import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import { motion } from "framer-motion";

// Datos de ejemplo
const reportesIniciales = [
  {
    id: 1,
    locker: "A-12",
    usuario: "Juan Pérez",
    descripcion: "El candado no cierra correctamente",
    estado: "pendiente",
    fecha: "2025-09-06",
    hora: "14:32",
  },
  {
    id: 2,
    locker: "B-03",
    usuario: "Ana Torres",
    descripcion: "El locker está sucio",
    estado: "en revisión",
    fecha: "2025-09-05",
    hora: "09:10",
  },
  {
    id: 3,
    locker: "C-21",
    usuario: "Carlos Gómez",
    descripcion: "Bisagra rota",
    estado: "resuelto",
    fecha: "2025-09-04",
    hora: "18:47",
  },
];

export default function ReportsView() {
  const [reportes, setReportes] = React.useState(reportesIniciales);

  const handleChangeEstado = (id, nuevoEstado) => {
    setReportes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r))
    );
  };

  const handleDelete = (id) => {
    setReportes((prev) => prev.filter((r) => r.id !== id));
  };

  const renderIcon = (estado) => {
    if (estado === "pendiente") {
      return <ReportProblemRoundedIcon color="warning" fontSize="large" />;
    }
    if (estado === "en revisión") {
      return <InfoRoundedIcon color="info" fontSize="large" />;
    }
    if (estado === "resuelto") {
      return <CheckCircleRoundedIcon color="success" fontSize="large" />;
    }
    return <ReportProblemRoundedIcon color="disabled" fontSize="large" />;
  };

  return (
    <Box sx={{ bgcolor: "#0D1117", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Título animado */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{ color: "#fff", fontWeight: "bold" }}
          >
            📋 Reportes de Lockers
          </Typography>
        </motion.div>

        <Stack spacing={3}>
          {reportes.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "#161B22",
                  color: "#fff",
                  "&:hover": { bgcolor: "#1F242C", transform: "scale(1.01)" },
                  transition: "all 0.3s ease",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  {renderIcon(r.estado)}
                  <Box>
                    <Typography variant="h6">
                      Locker {r.locker} – {r.usuario}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "gray" }}>
                      {r.descripcion}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "gray" }}>
                      {r.fecha} – {r.hora}
                    </Typography>
                  </Box>
                  <Chip
                    label={r.estado}
                    sx={{ ml: "auto" }}
                    color={
                      r.estado === "pendiente"
                        ? "warning"
                        : r.estado === "en revisión"
                        ? "info"
                        : "success"
                    }
                  />
                </Stack>

                {/* Botones de acción */}
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    color="warning"
                    size="small"
                    onClick={() => handleChangeEstado(r.id, "pendiente")}
                  >
                    Pendiente
                  </Button>
                  <Button
                    variant="outlined"
                    color="info"
                    size="small"
                    onClick={() => handleChangeEstado(r.id, "en revisión")}
                  >
                    En revisión
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleChangeEstado(r.id, "resuelto")}
                  >
                    Resuelto
                  </Button>

                  <IconButton
                    size="small"
                    sx={{ ml: "auto", color: "gray" }}
                    onClick={() => handleDelete(r.id)}
                  >
                    <DeleteRoundedIcon />
                  </IconButton>
                </Stack>
              </Paper>
            </motion.div>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
