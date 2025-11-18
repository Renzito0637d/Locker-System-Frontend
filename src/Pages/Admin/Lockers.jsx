import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Lockers() {
  const [lockers, setLockers] = useState(() => {
    const saved = localStorage.getItem("lockers");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, numero: "A01", estado: "Disponible" },
          { id: 2, numero: "B02", estado: "Ocupado" },
          { id: 3, numero: "A15", estado: "Disponible" },
        ];
  });

  useEffect(() => {
    localStorage.setItem("lockers", JSON.stringify(lockers));
  }, [lockers]);

  const [numero, setNumero] = useState("");
  const [estado, setEstado] = useState("Disponible");
  const [editId, setEditId] = useState(null);

  const getUbicacion = (numero) => {
    if (!numero || numero.length < 2) return "";
    const pabellon = numero[0].toUpperCase();
    const piso = parseInt(numero.slice(1), 10);
    if (isNaN(piso)) return `Pabellón ${pabellon}`;
    return `Pabellón ${pabellon}, Piso ${piso}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!numero || numero.length < 2) return;

    if (editId !== null) {
      setLockers((prev) =>
        prev.map((l) => (l.id === editId ? { ...l, numero, estado } : l))
      );
      setEditId(null);
    } else {
      const nextId = lockers.length > 0 ? Math.max(...lockers.map((l) => l.id)) + 1 : 1;
      const newLocker = { id: nextId, numero, estado };
      setLockers((prev) => [...prev, newLocker]);
    }

    setNumero("");
    setEstado("Disponible");
  };

  const handleEdit = (id) => {
    const locker = lockers.find((l) => l.id === id);
    if (!locker) return;
    setEditId(locker.id);
    setNumero(locker.numero);
    setEstado(locker.estado);
  };

  const handleDelete = (id) => {
    setLockers((prev) => prev.filter((l) => l.id !== id));
    if (editId === id) {
      setEditId(null);
      setNumero("");
      setEstado("Disponible");
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#121212", minHeight: "100vh" }}>
      <Card elevation={0} sx={{ backgroundColor: "#1e1e1e", color: "white" }}>
        <CardContent>
          <Typography variant="h4" align="left" color="primary" mb={3}>
            Gestión de Lockers
          </Typography>

          {/* FORMULARIO */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
            <Box display="flex" gap={2} flexWrap="wrap">
              <TextField
                label="Número de Locker (ej: A01, B15)"
                value={numero}
                onChange={(e) => {
                  let val = e.target.value.toUpperCase();
                  val = val.replace(/[^A-B0-9]/g, "");
                  if (val.length > 0) {
                    val = val[0].replace(/[^A-B]/, "") + val.slice(1, 3).replace(/[^0-9]/g, "");
                  }
                  setNumero(val.slice(0, 3));
                }}
                variant="filled"
                sx={{ backgroundColor: "#2a2a2a", input: { color: "white" }, flex: 1, minWidth: 200 }}
              />
              <FormControl variant="filled" sx={{ minWidth: 180, backgroundColor: "#2a2a2a" }}>
                <InputLabel sx={{ color: "#aaa" }}>Estado</InputLabel>
                <Select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  sx={{ color: "white" }}
                >
                  <MenuItem value="Disponible">Disponible</MenuItem>
                  <MenuItem value="Ocupado">Ocupado</MenuItem>
                  <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                </Select>
              </FormControl>
              <Box display="flex" alignItems="center">
                <Button type="submit" variant="contained" sx={{ textTransform: "none", px: 3 }}>
                  {editId ? "Guardar" : "Agregar"}
                </Button>
              </Box>
            </Box>
          </Box>

          {/* TABLA */}
          <Table sx={{ backgroundColor: "#1a1a1a" }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1a1a1a" }}>
                <TableCell sx={{ color: "white" }}>ID</TableCell>
                <TableCell sx={{ color: "white" }}>Número</TableCell>
                <TableCell sx={{ color: "white" }}>Ubicación</TableCell>
                <TableCell sx={{ color: "white" }}>Estado</TableCell>
                <TableCell sx={{ color: "white" }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lockers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: "white" }}>
                    No hay lockers registrados
                  </TableCell>
                </TableRow>
              ) : (
                lockers.map((locker) => (
                  <TableRow key={locker.id}>
                    <TableCell sx={{ color: "white" }}>{locker.id}</TableCell>
                    <TableCell sx={{ color: "white" }}>{locker.numero}</TableCell>
                    <TableCell sx={{ color: "white" }}>{getUbicacion(locker.numero)}</TableCell>
                    <TableCell>
                      <Chip
                        label={locker.estado}
                        color={
                          locker.estado === "Disponible"
                            ? "success"
                            : locker.estado === "Ocupado"
                            ? "error"
                            : "warning"
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="warning" onClick={() => handleEdit(locker.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(locker.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
