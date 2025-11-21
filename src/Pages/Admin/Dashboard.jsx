import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Container,
  CircularProgress
} from "@mui/material";

import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import { getAllUsers } from "../../services/UserService";
import { getAllReportes } from "../../services/ReporteService";
import { getLockers } from "../../services/ReservaService";

// Importamos los servicios que acabamos de regenerar

// Tarjeta de KPI reutilizable
function StatCard({ icon, label, value, color = "primary" }) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 48,
          height: 48,
          borderRadius: 2,
          bgcolor: (t) => t.palette[color].main,
          color: (t) => t.palette.getContrastText(t.palette[color].main),
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography color="text.secondary">{label}</Typography>
        <Typography variant="h5" noWrap>
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    usuarios: 0,
    lockersTotal: 0,
    lockersLibres: 0,
    lockersOcupados: 0,
    lockersMantenimiento: 0,
    reportes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersData, lockersData, reportesData] = await Promise.all([
          getAllUsers(),
          getLockers(),
          getAllReportes()
        ]);

        const countUsers = Array.isArray(usersData) ? usersData.length : 0;

        const lockers = Array.isArray(lockersData) ? lockersData : [];
        const total = lockers.length;
        const libres = lockers.filter(l => l.estado === "DISPONIBLE").length;
        const ocupados = lockers.filter(l => l.estado === "OCUPADO").length;
        const mantenimiento = total - (libres + ocupados);

        const reportsRaw = Array.isArray(reportesData) ? reportesData : [];
        const reportsRecent = reportsRaw
          .sort((a, b) => new Date(b.fechaReporte) - new Date(a.fechaReporte))
          .slice(0, 5);

        setStats({
          usuarios: countUsers,
          lockersTotal: total,
          lockersLibres: libres,
          lockersOcupados: ocupados,
          lockersMantenimiento: mantenimiento,
          reportes: reportsRecent
        });

      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  const { usuarios, lockersTotal, lockersLibres, lockersOcupados, lockersMantenimiento, reportes } = stats;
  const ocupacion = lockersTotal > 0 ? (lockersOcupados / lockersTotal) * 100 : 0;
  const disponibilidad = lockersTotal > 0 ? (lockersLibres / lockersTotal) * 100 : 0;

  const getReportColor = (estado) => {
    if (estado === "SOLUCIONADO") return "success";
    if (estado === "REVISADO") return "info";
    return "warning";
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Panel de Control
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          alignItems: "stretch",
          marginBottom: "20px",
        }}
      >
        <StatCard
          icon={<PeopleAltRoundedIcon />}
          label="Usuarios"
          value={usuarios}
          color="primary"
        />
        <StatCard
          icon={<Inventory2RoundedIcon />}
          label="Lockers totales"
          value={lockersTotal}
          color="info"
        />
        <StatCard
          icon={<LockOpenRoundedIcon />}
          label="Lockers libres"
          value={lockersLibres}
          color="success"
        />
        <StatCard
          icon={<LockRoundedIcon />}
          label="Lockers ocupados"
          value={lockersOcupados}
          color="warning"
        />
        <StatCard
          icon={<BuildRoundedIcon />}
          label="Mantenimiento"
          value={lockersMantenimiento}
          color="error"
        />
      </Box>

      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="center"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              minWidth: 240,
            }}
          >
            <QueryStatsRoundedIcon color="primary" />
            <Typography variant="h6" sx={{ mr: 1 }}>
              Tasa de ocupación:
            </Typography>
            <Chip
              label={`${ocupacion.toFixed(0)}%`}
              color="primary"
              size="small"
            />
          </Box>

          <Box sx={{ flex: 1, width: "100%" }}>
            <LinearProgress
              variant="determinate"
              value={ocupacion}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 0.75 }}
            >
              <Typography variant="caption" color="text.secondary">
                Disponibilidad: {disponibilidad.toFixed(0)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ocupados: {lockersOcupados}/{lockersTotal}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Últimos reportes registrados
        </Typography>
        <Divider sx={{ mb: 1 }} />

        {reportes.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
            No hay reportes recientes.
          </Typography>
        ) : (
          <List dense>
            {reportes.map((r) => (
              <ListItem key={r.id} disableGutters divider>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <ReportProblemRoundedIcon color="error" />
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight="bold">
                      {r.tipoReporte} - Locker {r.locker?.numeroLocker || "?"}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {r.descripcion?.substring(0, 50)}...
                    </Typography>
                  }
                />

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                  <Chip
                    label={r.estado}
                    size="small"
                    color={getReportColor(r.estado)}
                    variant={r.estado === "PENDIENTE" ? "filled" : "outlined"}
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}