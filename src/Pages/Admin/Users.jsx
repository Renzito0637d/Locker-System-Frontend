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
  Chip,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Users() {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("users");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            nombre: "Juan",
            apellido: "Zarate",
            correo: "juan@correo.com",
            rol: "Admin",
          },
          {
            id: 2,
            nombre: "María",
            apellido: "Vargas",
            correo: "maria@correo.com",
            rol: "Usuario",
          },
          {
            id: 3,
            nombre: "Carlos",
            apellido: "Repudio",
            correo: "carlos@correo.com",
            rol: "Usuario",
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("Usuario");
  const [editId, setEditId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !apellido || !correo) return;

    if (editId !== null) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editId ? { ...u, nombre, apellido, correo, rol } : u
        )
      );
      setEditId(null);
    } else {
      const nextId =
        users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      const newUser = { id: nextId, nombre, apellido, correo, rol };
      setUsers((prev) => [...prev, newUser]);
    }

    setNombre("");
    setApellido("");
    setCorreo("");
    setRol("Usuario");
  };

  const handleEdit = (id) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    setEditId(user.id);
    setNombre(user.nombre);
    setApellido(user.apellido);
    setCorreo(user.correo);
    setRol(user.rol);
  };

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (editId === id) {
      setEditId(null);
      setNombre("");
      setApellido("");
      setCorreo("");
      setRol("Usuario");
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#121212", minHeight: "100vh" }}>
      <Card elevation={0} sx={{ backgroundColor: "#1e1e1e", color: "white" }}>
        <CardContent>
          {/* FORMULARIO */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}
          >
            <Box display="flex" gap={2} flexWrap="wrap">
              <TextField
                label="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                variant="filled"
                sx={{
                  backgroundColor: "#2a2a2a",
                  input: { color: "white" },
                  minWidth: 200,
                  flex: 1,
                }}
              />
              <TextField
                label="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                variant="filled"
                sx={{
                  backgroundColor: "#2a2a2a",
                  input: { color: "white" },
                  minWidth: 200,
                  flex: 1,
                }}
              />
              <TextField
                label="Correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                variant="filled"
                sx={{
                  backgroundColor: "#2a2a2a",
                  input: { color: "white" },
                  minWidth: 250,
                  flex: 1,
                }}
              />
              <FormControl
                variant="filled"
                sx={{ minWidth: 150, backgroundColor: "#2a2a2a" }}
              >
                <InputLabel sx={{ color: "#aaa" }}>Rol</InputLabel>
                <Select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  sx={{ color: "white" }}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Usuario">Usuario</MenuItem>
                </Select>
              </FormControl>
              <Box display="flex" alignItems="center">
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ textTransform: "none", px: 3 }}
                >
                  Guardar
                </Button>
              </Box>
            </Box>
          </Box>

          {/* TABLA */}
          <Table sx={{ backgroundColor: "#1a1a1a" }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1a1a1a" }}>
                <TableCell sx={{ color: "white" }}>ID</TableCell>
                <TableCell sx={{ color: "white" }}>Nombre</TableCell>
                <TableCell sx={{ color: "white" }}>Apellido</TableCell>
                <TableCell sx={{ color: "white" }}>Correo</TableCell>
                <TableCell sx={{ color: "white" }}>Rol</TableCell>
                <TableCell sx={{ color: "white" }} align="center">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: "white" }}>
                    No hay usuarios registrados
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell sx={{ color: "white" }}>{user.id}</TableCell>
                    <TableCell sx={{ color: "white" }}>{user.nombre}</TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {user.apellido}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>{user.correo}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.rol}
                        color={user.rol === "Admin" ? "primary" : "default"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="warning"
                        onClick={() => handleEdit(user.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(user.id)}
                      >
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

