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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Ubicacion() {
    const [ubicaciones, setUbicaciones] = useState(() => {
        const dataGuardada = localStorage.getItem("ubicaciones");
        return dataGuardada
            ? JSON.parse(dataGuardada)
            : [
                  {
                      id: 1,
                      nombre: "Edificio A",
                      descripcion: "Primer piso, pasillo central",
                      pabellon: "A",
                      piso: 1,
                  },
                  {
                      id: 2,
                      nombre: "Edificio B",
                      descripcion: "Segundo piso, junto a la cafetería",
                      pabellon: "B",
                      piso: 2,
                  },
                  {
                      id: 3,
                      nombre: "Gimnasio",
                      descripcion: "Entrada principal",
                      pabellon: "A",
                      piso: 1,
                  },
              ];
    });

    const [newPlace, setNewPlace] = useState({
        nombre: "",
        descripcion: "",
        pabellon: "",
        piso: "",
    });

    const [editId, setEditId] = useState(null);

    useEffect(() => {
        localStorage.setItem("ubicaciones", JSON.stringify(ubicaciones));
    }, [ubicaciones]);

    const handleAddPlace = () => {
        if (!newPlace.nombre || !newPlace.descripcion) return;

        if (editId !== null) {
            // EDITAR
            setUbicaciones((prev) =>
                prev.map((u) =>
                    u.id === editId ? { ...u, ...newPlace } : u
                )
            );
            setEditId(null);
        } else {
            // AGREGAR
            const nextId =
                ubicaciones.length > 0
                    ? Math.max(...ubicaciones.map((u) => u.id)) + 1
                    : 1;
            setUbicaciones([
                ...ubicaciones,
                {
                    id: nextId,
                    ...newPlace,
                },
            ]);
        }

        setNewPlace({ nombre: "", descripcion: "", pabellon: "", piso: "" });
    };

    const handleEdit = (id) => {
        const lugar = ubicaciones.find((u) => u.id === id);
        if (!lugar) return;
        setEditId(id);
        setNewPlace({
            nombre: lugar.nombre,
            descripcion: lugar.descripcion,
            pabellon: lugar.pabellon,
            piso: lugar.piso,
        });
    };

    const handleDelete = (id) => {
        setUbicaciones((prev) => prev.filter((u) => u.id !== id));
        if (editId === id) {
            setEditId(null);
            setNewPlace({ nombre: "", descripcion: "", pabellon: "", piso: "" });
        }
    };

    return (
        <Box p={3} sx={{ backgroundColor: "#121212", minHeight: "100vh" }}>
            {/* ------------------- FORMULARIO ------------------- */}
            <Box display="flex" flexDirection="column" gap={2} mb={3} sx={{ width: "100%" }}>
                <Box display="flex" gap={2} flexWrap="wrap" sx={{ width: "100%" }}>
                    <TextField
                        label="Nombre"
                        value={newPlace.nombre}
                        onChange={(e) => setNewPlace({ ...newPlace, nombre: e.target.value })}
                        sx={{ minWidth: 300, flex: 1}}
                        
                    />

                    <TextField
                        label="Pabellón"
                        value={newPlace.pabellon}
                        onChange={(e) => setNewPlace({ ...newPlace, pabellon: e.target.value })}
                        sx={{ minWidth: 250, flex: 1}}
                        
                    />

                    <TextField
                        label="Piso"
                        value={newPlace.piso}
                        onChange={(e) => setNewPlace({ ...newPlace, piso: e.target.value })}
                        sx={{ minWidth: 200, flex: 1}}
                        
                    />
                </Box>

                <TextField
                    label="Descripción"
                    multiline
                    rows={4}
                    value={newPlace.descripcion}
                    onChange={(e) => setNewPlace({ ...newPlace, descripcion: e.target.value })}
                    sx={{ width: "100%"}}
                    
                />

                <Box display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        onClick={handleAddPlace}
                        sx={{
                            textTransform: "none",
                            boxShadow: "none",
                            borderRadius: 0,
                            px: 4,
                        }}
                    >
                        {editId ? "Guardar" : "Agregar"}
                    </Button>
                </Box>
            </Box>

            {/* ------------------- TABLA ------------------- */}
            <Table sx={{ backgroundColor: "#1a1a1a" }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#1a1a1a" }}>
                        <TableCell sx={{ color: "white" }}>ID</TableCell>
                        <TableCell sx={{ color: "white" }}>Nombre</TableCell>
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
                            <TableCell sx={{ color: "white" }}>{u.nombre}</TableCell>
                            <TableCell sx={{ color: "white" }}>{u.pabellon}</TableCell>
                            <TableCell sx={{ color: "white" }}>{u.piso}</TableCell>
                            <TableCell sx={{ color: "white" }}>{u.descripcion}</TableCell>
                            <TableCell align="center">
                                <IconButton color="warning" onClick={() => handleEdit(u.id)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDelete(u.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
}
