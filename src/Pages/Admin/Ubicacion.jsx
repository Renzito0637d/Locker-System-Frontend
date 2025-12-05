import { useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    Paper,
    MenuItem,
    TableContainer // <--- IMPORTANTE: Agregado para el scroll horizontal
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { createUbicacion, deleteUbicacion, getUbicaciones, updateUbicacion } from "../../services/UbicacionService";

export default function Ubicacion() {
    // 1. Estado para la lista de la tabla
    const [ubicaciones, setUbicaciones] = useState([]);

    // 2. Estado para el formulario (Coincide con UbicacionRequest.java)
    const initialFormState = {
        nombreEdificio: "",
        pabellon: "",
        piso: "",
        descripcion: ""
    };
    const [form, setForm] = useState(initialFormState);

    // 3. Estado para controlar si editamos o creamos
    const [editId, setEditId] = useState(null);

    // CARGAR DATOS AL INICIO
    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const data = await getUbicaciones();
            console.log("Datos recibidos del backend:", data);

            if (Array.isArray(data)) {
                setUbicaciones(data);
            }
            else if (data.content && Array.isArray(data.content)) {
                setUbicaciones(data.content);
            }
            else {
                console.warn("El formato recibido no es una lista", data);
                setUbicaciones([]);
            }

        } catch (error) {
            console.error("Error cargando ubicaciones:", error);
            setUbicaciones([]);
        }
    };

    // MANEJAR CAMBIOS EN INPUTS
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // GUARDAR (CREAR O EDITAR)
    const handleSave = async () => {
        if (!form.nombreEdificio || !form.pabellon || !form.piso) {
            alert("Completa los campos obligatorios");
            return;
        }

        try {
            if (editId) {
                await updateUbicacion(editId, form);
            } else {
                await createUbicacion(form);
            }

            setForm(initialFormState);
            setEditId(null);
            cargarDatos();
        } catch (error) {
            console.error("Error guardando:", error);
            alert("Error al guardar. Revisa la consola.");
        }
    };

    // PREPARAR EDICIÓN
    const handleEdit = (ubicacion) => {
        setEditId(ubicacion.id);
        setForm({
            nombreEdificio: ubicacion.nombreEdificio,
            pabellon: ubicacion.pabellon,
            piso: ubicacion.piso,
            descripcion: ubicacion.descripcion || ""
        });
    };

    // ELIMINAR
    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro de eliminar esta ubicación?")) return;

        try {
            await deleteUbicacion(id);
            cargarDatos();
        } catch (error) {
            console.error("Error eliminando:", error);
        }
    };

    return (
        // CAMBIO 1: Padding dinámico (xs: 2 para móvil, md: 3 para escritorio)
        <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: "#121212", minHeight: "100vh" }}>
            <Typography variant="h5" color="white" mb={2}>Gestión de Ubicaciones</Typography>

            {/* ------------------- FORMULARIO ------------------- */}
            <Box
                display="flex"
                flexDirection="column"
                gap={2}
                mb={3}
                component={Paper}
                sx={{ p: 2, backgroundColor: '#1e1e1e' }}
            >
                <Box
                    display="flex"
                    // CAMBIO 2: Stack vertical en móvil (column), fila en escritorio (row)
                    flexDirection={{ xs: "column", md: "row" }}
                    gap={2}
                    sx={{ width: "100%" }}
                >
                    <TextField
                        label="Nombre Edificio"
                        name="nombreEdificio"
                        value={form.nombreEdificio}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth // Ocupa todo el ancho disponible
                        sx={{ input: { color: 'white' }, label: { color: 'gray' } }}
                    />

                    <TextField
                        select
                        label="Pabellón"
                        name="pabellon"
                        value={form.pabellon}
                        onChange={handleChange}
                        fullWidth // Ocupa todo el ancho disponible
                        sx={{
                            "& .MuiSelect-select": { color: "white" },
                            "& .MuiInputLabel-root": { color: "gray" },
                            "& .MuiSvgIcon-root": { color: "white" }
                        }}
                    >
                        <MenuItem value="A">Pabellón A</MenuItem>
                        <MenuItem value="B">Pabellón B</MenuItem>
                    </TextField>

                    <TextField
                        select
                        label="Piso"
                        name="piso"
                        value={form.piso}
                        onChange={handleChange}
                        fullWidth // Ocupa todo el ancho disponible
                        sx={{
                            "& .MuiSelect-select": { color: "white" },
                            "& .MuiInputLabel-root": { color: "gray" },
                            "& .MuiSvgIcon-root": { color: "white" }
                        }}
                    >
                        {Array.from({ length: 15 }, (_, i) => i + 1).map((pisoNum) => (
                            <MenuItem
                                key={pisoNum}
                                value={String(pisoNum)}
                            >
                                Piso {pisoNum}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                <TextField
                    label="Descripción"
                    name="descripcion"
                    multiline
                    rows={2}
                    value={form.descripcion}
                    onChange={handleChange}
                    fullWidth
                    sx={{ textarea: { color: 'white' }, label: { color: 'gray' } }}
                />

                <Box display="flex" justifyContent="flex-end" gap={2}>
                    {editId && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => { setEditId(null); setForm(initialFormState); }}
                            // CAMBIO 3: Botón adaptable
                            sx={{ minWidth: { xs: "100px", md: "auto" } }}
                        >
                            Cancelar
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{ textTransform: "none", px: 4, minWidth: { xs: "100px", md: "auto" } }}
                    >
                        {editId ? "Actualizar" : "Agregar"}
                    </Button>
                </Box>
            </Box>

            {/* ------------------- TABLA CON SCROLL ------------------- */}
            {/* CAMBIO 4: TableContainer para scroll horizontal */}
            <TableContainer component={Paper} sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
                <Table sx={{ backgroundColor: "#1a1a1a" }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#333" }}>
                            <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>ID</TableCell>
                            <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>Edificio</TableCell>
                            <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>Pabellón</TableCell>
                            <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>Piso</TableCell>
                            <TableCell sx={{ color: "white", minWidth: 200 }}>Descripción</TableCell>
                            <TableCell sx={{ color: "white" }} align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ubicaciones.map((u) => (
                            <TableRow key={u.id}>
                                <TableCell sx={{ color: "white" }}>{u.id}</TableCell>
                                <TableCell sx={{ color: "white" }}>{u.nombreEdificio}</TableCell>
                                <TableCell sx={{ color: "white" }}>{u.pabellon}</TableCell>
                                <TableCell sx={{ color: "white" }}>{u.piso}</TableCell>
                                <TableCell sx={{ color: "white" }}>{u.descripcion}</TableCell>
                                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                                    <IconButton color="warning" onClick={() => handleEdit(u)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(u.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {ubicaciones.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ color: "gray" }}>
                                    No hay ubicaciones registradas
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}