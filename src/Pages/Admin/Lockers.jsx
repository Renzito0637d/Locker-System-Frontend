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

const API = "http://localhost:8081/api/lockers";

export default function Lockers() {
  const [lockers, setLockers] = useState([]);
  const [numero, setNumero] = useState("");
  const [estado, setEstado] = useState("disponible");
  const [ubicaciones, setUbicaciones] = useState([]);
  const [ubicacionId, setUbicacionId] = useState("");
  const [editId, setEditId] = useState(null);

  // 1. Cargar desde backend
  useEffect(() => {
    fetch(API + "/")
      .then((res) => res.json())
      .then((data) => setLockers(data))
      .catch(() => console.log("Error cargando lockers"));
  }, []);
  useEffect(() => {
    fetch("http://localhost:8081/api/ubicaciones")
      .then((res) => res.json())
      .then((data) => setUbicaciones(data))
      .catch(() => console.log("Error cargando ubicaciones"));
  }, []);

  // 2. Crear o editar
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!numero) return;

    const body = {
      numeroLocker: numero,
      estado: estado.toLowerCase(),
      ubicacionId: ubicacionId,
    };

    try {
      if (editId === null) {
        const res = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          console.log("Error backend:", res.status);
          return;
        }

        const newLocker = await res.json();
        setLockers((prev) => [...prev, newLocker]);
      } else {
        const res = await fetch(`${API}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          console.log("Error backend:", res.status);
          return;
        }

        const updated = await res.json();
        setLockers((prev) => prev.map((l) => (l.id === editId ? updated : l)));
        setEditId(null);
      }
    } catch (error) {
      console.log("Error guardando locker", error);
    }

    setNumero("");
    setEstado("disponible");
  };

  // 3. Preparar edición
  const handleEdit = (locker) => {
    setEditId(locker.id);
    setNumero(locker.numeroLocker);
    setEstado(locker.estado.toLowerCase());
  };

  // 4. Eliminar
  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setLockers((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#121212", minHeight: "100vh" }}>
      <Card elevation={0} sx={{ backgroundColor: "#1e1e1e", color: "white" }}>
        <CardContent>
          <Typography variant="h4" color="primary" mb={3}>
            Gestión de Lockers
          </Typography>

          {/* FORM */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", gap: 2, mb: 4 }}
          >
            <TextField
              label="Número"
              value={numero}
              onChange={(e) => setNumero(e.target.value.toUpperCase())}
              variant="filled"
              sx={{ backgroundColor: "#2a2a2a", input: { color: "white" } }}
            />

            <FormControl
              variant="filled"
              sx={{ minWidth: 180, backgroundColor: "#2a2a2a" }}
            >
              <InputLabel sx={{ color: "#aaa" }}>Estado</InputLabel>
              <Select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                sx={{ color: "white" }}
              >
                <MenuItem value="disponible">Disponible</MenuItem>
                <MenuItem value="ocupado">Ocupado</MenuItem>
                <MenuItem value="en mantenimiento">Mantenimiento</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              variant="filled"
              sx={{ minWidth: 180, backgroundColor: "#2a2a2a" }}
            >
              <InputLabel sx={{ color: "#aaa" }}>Ubicación</InputLabel>
              <Select
                value={ubicacionId}
                onChange={(e) => setUbicacionId(e.target.value)}
                sx={{ color: "white" }}
              >
                {ubicaciones.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.pabellon} - {u.piso}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button type="submit" variant="contained">
              {editId ? "Actualizar" : "Agregar"}
            </Button>
          </Box>

          {/* TABLA */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white" }}>ID</TableCell>
                <TableCell sx={{ color: "white" }}>Número</TableCell>
                <TableCell sx={{ color: "white" }}>Estado</TableCell>
                <TableCell sx={{ color: "white" }}>Ubicación</TableCell>
                <TableCell sx={{ color: "white" }} align="center">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {lockers.map((locker) => (
                <TableRow key={locker.id}>
                  <TableCell sx={{ color: "white" }}>{locker.id}</TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {locker.numeroLocker}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={locker.estado}
                      color={
                        locker.estado === "disponible"
                          ? "success"
                          : locker.estado === "ocupado"
                          ? "error"
                          : "warning"
                      }
                    />
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {locker.ubicacion}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      color="warning"
                      onClick={() => handleEdit(locker)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(locker.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {lockers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} sx={{ color: "white" }} align="center">
                    No hay lockers
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
         
    </Box>
  );
}
