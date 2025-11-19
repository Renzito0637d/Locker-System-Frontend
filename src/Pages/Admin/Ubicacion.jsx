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
    MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { createUbicacion, deleteUbicacion, getUbicaciones, updateUbicacion } from "../../services/UbicacionService";

export default function Ubicacion() {
    // 1. Estado para la lista de la tabla
    const [ubicaciones, setUbicaciones] = useState([]);

    // 2. Estado para el formulario (Coincide con UbicacionRequest.java)
    const initialFormState = {
        nombreEdificio: "", // ANTES "nombre", AHORA "nombreEdificio"
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
        console.log("Datos recibidos del backend:", data); // <--- MIRA LA CONSOLA DEL NAVEGADOR

        // CASO A: Spring Boot devuelve una lista directa: [ {..}, {..} ]
        if (Array.isArray(data)) {
            setUbicaciones(data);
        } 
        // CASO B: Spring Boot devuelve Paginación: { content: [..], pageable: {..} }
        else if (data.content && Array.isArray(data.content)) {
            setUbicaciones(data.content);
        }
        // CASO C: Algún otro error u objeto vacío
        else {
            console.warn("El formato recibido no es una lista", data);
            setUbicaciones([]); // Evita que rompa la pantalla
        }

    } catch (error) {
        console.error("Error cargando ubicaciones:", error);
        setUbicaciones([]); // En caso de error, lista vacía
    }
};

    // MANEJAR CAMBIOS EN INPUTS
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // GUARDAR (CREAR O EDITAR)
    const handleSave = async () => {
        // Validacion simple
        if (!form.nombreEdificio || !form.pabellon || !form.piso) {
            alert("Completa los campos obligatorios");
            return;
        }

        try {
            if (editId) {
                // MODO EDICIÓN (PUT)
                await updateUbicacion(editId, form);
            } else {
                // MODO CREACIÓN (POST)
                await createUbicacion(form);
            }

            // Resetear formulario y recargar tabla
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
        <Box p={3} sx={{ backgroundColor: "#121212", minHeight: "100vh" }}>
            <Typography variant="h5" color="white" mb={2}>Gestión de Ubicaciones</Typography>

            {/* ------------------- FORMULARIO ------------------- */}
            <Box display="flex" flexDirection="column" gap={2} mb={3} component={Paper} sx={{ p: 2, backgroundColor: '#1e1e1e' }}>
                <Box display="flex" gap={2} flexWrap="wrap" sx={{ width: "100%" }}>
                    {/* OJO: El 'name' debe coincidir con la key del estado 'form' */}
                    <TextField
                        label="Nombre Edificio"
                        name="nombreEdificio"
                        value={form.nombreEdificio}
                        onChange={handleChange}
                        sx={{ minWidth: 300, flex: 1, input: { color: 'white' }, label: { color: 'gray' } }}
                        variant="outlined"
                    />

                    <TextField
                        select // <--- Esto lo convierte en dropdown
                        label="Pabellón"
                        name="pabellon"
                        value={form.pabellon}
                        onChange={handleChange}
                        sx={{ 
                            minWidth: 250, 
                            flex: 1, 
                            // Color del texto seleccionado
                            "& .MuiSelect-select": { color: "white" },
                            // Color del label
                            "& .MuiInputLabel-root": { color: "gray" },
                            // Color de la flechita del dropdown
                            "& .MuiSvgIcon-root": { color: "white" }
                        }}
                    >
                        <MenuItem value="A">Pabellón A</MenuItem>
                        <MenuItem value="B">Pabellón B</MenuItem>
                    </TextField>

                    <TextField
                        label="Piso"
                        name="piso"
                        value={form.piso}
                        onChange={handleChange}
                        sx={{ minWidth: 200, flex: 1, input: { color: 'white' }, label: { color: 'gray' } }}
                    />
                </Box>

                <TextField
                    label="Descripción"
                    name="descripcion"
                    multiline
                    rows={2}
                    value={form.descripcion}
                    onChange={handleChange}
                    sx={{ width: "100%", textarea: { color: 'white' }, label: { color: 'gray' } }}
                />

                <Box display="flex" justifyContent="flex-end" gap={2}>
                    {editId && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => { setEditId(null); setForm(initialFormState); }}
                        >
                            Cancelar
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{ textTransform: "none", px: 4 }}
                    >
                        {editId ? "Actualizar" : "Agregar"}
                    </Button>
                </Box>
            </Box>

            {/* ------------------- TABLA ------------------- */}
            <Table sx={{ backgroundColor: "#1a1a1a" }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#333" }}>
                        <TableCell sx={{ color: "white" }}>ID</TableCell>
                        <TableCell sx={{ color: "white" }}>Edificio</TableCell>
                        <TableCell sx={{ color: "white" }}>Pabellón</TableCell>
                        <TableCell sx={{ color: "white" }}>Piso</TableCell>
                        <TableCell sx={{ color: "white" }}>Descripción</TableCell>
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
                            <TableCell align="center">
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
        </Box>
    );
}
