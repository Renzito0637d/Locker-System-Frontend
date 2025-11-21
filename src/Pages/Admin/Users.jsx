import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Switch,
  Tooltip,
  CircularProgress,
  TableContainer
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import { getAllUsers, createUser, updateUser, deleteUser, toggleUserActive } from "../../services/UserService";

export default function Users() {
  // Estados de datos
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado del Formulario
  const initialForm = {
    id: null,
    userName: "",
    nombre: "",
    apellido: "",
    email: "",
    password: "", // Solo se usa al crear o cambiar
    role: "ESTUDIANTE" // Valor por defecto
  };
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      // Validación defensiva por si el backend devuelve null
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando usuarios", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Manejar inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Guardar (Crear o Editar)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // EDITAR
        // Si el password está vacío, lo quitamos del objeto para no sobreescribirlo con vacío
        const payload = { ...form };
        if (!payload.password) delete payload.password;

        await updateUser(form.id, payload);
        alert("Usuario actualizado correctamente");
      } else {
        // CREAR
        if (!form.password) {
          alert("La contraseña es obligatoria para nuevos usuarios");
          return;
        }
        await createUser(form);
        alert("Usuario creado correctamente");
      }

      // Resetear y recargar
      resetForm();
      cargarUsuarios();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar (Revisa si el usuario/email ya existe)");
    }
  };

  const handleEdit = (user) => {
    // Extraer el rol principal del Set de roles
    const roleName = user.roles && user.roles.length > 0 ? user.roles[0] : "ESTUDIANTE";

    setForm({
      id: user.id,
      userName: user.userName,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email || "",
      password: "", // No traemos el hash por seguridad, se deja vacío
      role: roleName
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.")) return;
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error(error);
      alert("Error al eliminar usuario");
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await toggleUserActive(id);
      // Actualizar estado local
      setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setIsEditing(false);
  };

  if (loading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3, backgroundColor: "#121212", minHeight: "100vh" }}>
      <Typography variant="h4" color="white" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Gestión de Usuarios
      </Typography>

      <Card elevation={3} sx={{ backgroundColor: "#1e1e1e", color: "white", mb: 4 }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            {isEditing ? "Editar Usuario" : "Registrar Nuevo Usuario"}
          </Typography>

          {/* FORMULARIO */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Box display="flex" gap={2} flexWrap="wrap">
              <TextField
                label="Usuario (Login)"
                name="userName"
                value={form.userName}
                onChange={handleChange}
                variant="filled"
                required
                disabled={isEditing} // A veces el username no se debe cambiar
                sx={{ backgroundColor: "#2a2a2a", input: { color: "white" }, minWidth: 200, flex: 1 }}
                InputLabelProps={{ sx: { color: "#aaa" } }}
              />
              <TextField
                label="Nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                variant="filled"
                required
                sx={{ backgroundColor: "#2a2a2a", input: { color: "white" }, minWidth: 200, flex: 1 }}
                InputLabelProps={{ sx: { color: "#aaa" } }}
              />
              <TextField
                label="Apellido"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                variant="filled"
                required
                sx={{ backgroundColor: "#2a2a2a", input: { color: "white" }, minWidth: 200, flex: 1 }}
                InputLabelProps={{ sx: { color: "#aaa" } }}
              />
            </Box>

            <Box display="flex" gap={2} flexWrap="wrap">
              <TextField
                label="Correo Electrónico"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                variant="filled"
                required
                sx={{ backgroundColor: "#2a2a2a", input: { color: "white" }, minWidth: 250, flex: 2 }}
                InputLabelProps={{ sx: { color: "#aaa" } }}
              />

              {/* Campo Password: Obligatorio al crear, opcional al editar */}
              <TextField
                label={isEditing ? "Nueva Contraseña (Opcional)" : "Contraseña"}
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                variant="filled"
                required={!isEditing}
                sx={{ backgroundColor: "#2a2a2a", input: { color: "white" }, minWidth: 200, flex: 1 }}
                InputLabelProps={{ sx: { color: "#aaa" } }}
              />

              <FormControl variant="filled" sx={{ minWidth: 150, backgroundColor: "#2a2a2a", flex: 1 }}>
                <InputLabel sx={{ color: "#aaa" }}>Rol</InputLabel>
                <Select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  sx={{ color: "white" }}
                >
                  <MenuItem value="ADMIN">Administrador</MenuItem>
                  <MenuItem value="ESTUDIANTE">Estudiante</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box display="flex" gap={2} justifyContent="flex-end" mt={1}>
              {isEditing && (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ClearIcon />}
                  onClick={resetForm}
                >
                  Cancelar Edición
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                color="primary"
                sx={{ px: 4 }}
              >
                {isEditing ? "Actualizar Usuario" : "Guardar Usuario"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* TABLA */}
      <TableContainer component={Paper} sx={{ backgroundColor: "#1a1a1a" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#333" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 'bold' }}>Usuario</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 'bold' }}>Nombre Completo</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 'bold' }}>Correo</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 'bold' }}>Rol</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 'bold' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ color: "gray", py: 3 }}>
                  No hay usuarios registrados
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} hover sx={{ '&:hover': { backgroundColor: '#252525' } }}>
                  <TableCell sx={{ color: "white" }}>{user.id}</TableCell>
                  <TableCell sx={{ color: "white" }}>{user.userName}</TableCell>
                  <TableCell sx={{ color: "white" }}>{user.nombre} {user.apellido}</TableCell>
                  <TableCell sx={{ color: "white" }}>{user.email}</TableCell>
                  <TableCell>
                    {user.roles && user.roles.map(rol => (
                      <Chip
                        key={rol}
                        label={rol}
                        size="small"
                        color={rol === "ADMIN" ? "warning" : "info"}
                        sx={{ mr: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    {/* Switch para activar/desactivar */}
                    <Tooltip title={user.active ? "Usuario Activo" : "Usuario Inactivo"}>
                      <Switch
                        checked={user.active}
                        onChange={() => handleToggleActive(user.id)}
                        color="success"
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton color="primary" onClick={() => handleEdit(user)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar definitivamente">
                      <IconButton color="error" onClick={() => handleDelete(user.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

