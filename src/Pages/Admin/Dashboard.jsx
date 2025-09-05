import * as React from "react";
import {
    Box,
    Grid,
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
} from "@mui/material";

import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";

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
                <Typography color="text.secondary">
                    {label}
                </Typography>
                <Typography variant="h5" noWrap>{value}</Typography>
            </Box>
        </Paper>
    );
}

/**
 * ResumenSistema
 * Props:
 *  - usuarios, lockersTotal, lockersLibres, lockersOcupados, lockersMantenimiento
 *  - reportes: [{ id, titulo, descripcion, lugar, locker, estado }]
 */
export default function Dashboard({
    // Datos estaticos de ejemplo
    usuarios = 134,
    lockersTotal = 200,
    lockersLibres = 120,
    lockersOcupados = 70,
    lockersMantenimiento = 10,
    reportes = [
        { id: 1, titulo: "Locker #A-12 atascado", estado: "pendiente" },
        { id: 2, titulo: "Puerta #B-03 no cierra", estado: "en revisión" },
    ],
}) {
    const ocupacion = lockersTotal > 0 ? (lockersOcupados / lockersTotal) * 100 : 0;
    const disponibilidad = lockersTotal > 0 ? (lockersLibres / lockersTotal) * 100 : 0;

    return (
        <Container maxWidth="lg">

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
                <StatCard icon={<PeopleAltRoundedIcon />} label="Usuarios" value={usuarios} color="primary" />
                <StatCard icon={<Inventory2RoundedIcon />} label="Lockers totales" value={lockersTotal} color="info" />
                <StatCard icon={<LockOpenRoundedIcon />} label="Lockers libres" value={lockersLibres} color="success" />
                <StatCard icon={<LockRoundedIcon />} label="Lockers ocupados" value={lockersOcupados} color="warning" />
                <StatCard icon={<BuildRoundedIcon />} label="En mantenimiento" value={lockersMantenimiento} color="error" />
            </Box>

            {/* Bloque adicional: tasa de ocupación y disponibilidad */}
            <Paper elevation={2} sx={{ p: 2 }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 240 }}>
                        <QueryStatsRoundedIcon color="primary" />
                        <Typography variant="h6" sx={{ mr: 1 }}>
                            Tasa de ocupación:
                        </Typography>
                        <Chip label={`${ocupacion.toFixed(0)}%`} color="primary" size="small" />
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

            {/* Bloque : últimos reportes */}
            <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Últimos reportes
                </Typography>
                <Divider sx={{ mb: 1 }} />
                {reportes.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No hay reportes recientes.
                    </Typography>
                ) : (
                    <List dense>
                        {reportes.map((r) => (
                            <ListItem key={r.id} disableGutters>
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <ReportProblemRoundedIcon color="warning" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={r.titulo}
                                    secondary={
                                        <Chip
                                            label={r.estado}
                                            size="small"
                                            sx={{ mt: 0.5 }}
                                            color={r.estado === "pendiente" ? "warning" : "info"}
                                        />
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>
        </Container>
    );
}