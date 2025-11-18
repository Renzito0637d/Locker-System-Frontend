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
} from "@mui/material";

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

    useEffect(() => {
        localStorage.setItem("ubicaciones", JSON.stringify(ubicaciones));
    }, [ubicaciones]);

    const handleAddPlace = () => {
        if (!newPlace.nombre || !newPlace.descripcion) return;

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

        setNewPlace({ nombre: "", descripcion: "", pabellon: "", piso: "" });
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
                        sx={{ minWidth: 300, flex: 1 }}
                    />

                    <TextField
                        label="Pabellón"
                        value={newPlace.pabellon}
                        onChange={(e) => setNewPlace({ ...newPlace, pabellon: e.target.value })}
                        sx={{ minWidth: 250, flex: 1 }}
                    />

                    <TextField
                        label="Piso"
                        value={newPlace.piso}
                        onChange={(e) => setNewPlace({ ...newPlace, piso: e.target.value })}
                        sx={{ minWidth: 200, flex: 1 }}
                    />
                </Box>

                <TextField
                    label="Descripción"
                    multiline
                    rows={4}
                    value={newPlace.descripcion}
                    onChange={(e) => setNewPlace({ ...newPlace, descripcion: e.target.value })}
                    sx={{ width: "100%" }}
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
                        Agregar
                    </Button>
                </Box>
            </Box>

            {/* ------------------- TABLA ------------------- */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: "white" }}>ID</TableCell>
                        <TableCell sx={{ color: "white" }}>Nombre</TableCell>
                        <TableCell sx={{ color: "white" }}>Pabellón</TableCell>
                        <TableCell sx={{ color: "white" }}>Piso</TableCell>
                        <TableCell sx={{ color: "white" }}>Descripción</TableCell>
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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
}
