import React, { useState } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    Typography,
    Container,
} from "@mui/material";

export default function UbicacionesLockers() {

    const [sortBy, setSortBy] = useState("id");
    const [filterPabellon, setFilterPabellon] = useState("");
    const [filterPiso, setFilterPiso] = useState("");

    const data = [
        { id: 1, area: "A12", pabellon: "A", piso: 12, descripcion: "Cerca del laboratorio" },
        { id: 2, area: "A10", pabellon: "A", piso: 10, descripcion: "Frente a la biblioteca" },
        { id: 3, area: "B08", pabellon: "B", piso: 8, descripcion: "Al lado del gimnasio" },
        { id: 4, area: "A15", pabellon: "A", piso: 15, descripcion: "Pasillo central" },
        { id: 5, area: "B02", pabellon: "B", piso: 2, descripcion: "Cerca de la cafetería" },
        { id: 6, area: "A05", pabellon: "A", piso: 5, descripcion: "Junto a la sala de informática" },
        { id: 7, area: "B12", pabellon: "B", piso: 12, descripcion: "Zona norte" },
        { id: 8, area: "A03", pabellon: "A", piso: 3, descripcion: "Cerca del auditorio" },
        { id: 9, area: "B10", pabellon: "B", piso: 10, descripcion: "Pasillo sur" },
        { id: 10, area: "A08", pabellon: "A", piso: 8, descripcion: "Junto a la oficina de administración" },
    ];

    // Aplicar filtros
    const filteredData = data.filter((item) => {
        return (
            (filterPabellon ? item.pabellon === filterPabellon : true) &&
            (filterPiso ? item.piso === Number(filterPiso) : true)
        );
    });

    // Ordenar
    const sortedData = [...filteredData].sort((a, b) => {
        if (sortBy === "id") return a.id - b.id;
        if (sortBy === "pabellon") return a.pabellon.localeCompare(b.pabellon);
        if (sortBy === "piso") return a.piso - b.piso;
        return 0;
    });

    return (
        <>
            <Container maxWidth="lg">
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 3,
                            flexWrap: "wrap",
                            gap: 2,
                        }}
                    >
                        {/* Ordenar */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Ordenar por
                            </Typography>
                            <FormControl sx={{ minWidth: 150 }}>
                                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <MenuItem value="id">ID</MenuItem>
                                    <MenuItem value="pabellon">Pabellón</MenuItem>
                                    <MenuItem value="piso">Piso</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Buscar */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Buscar por
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                <FormControl sx={{ minWidth: 120 }}>
                                    <InputLabel>Pabellón</InputLabel>
                                    <Select
                                        value={filterPabellon}
                                        onChange={(e) => setFilterPabellon(e.target.value)}
                                        label="Pabellón"
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        <MenuItem value="A">A</MenuItem>
                                        <MenuItem value="B">B</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    label="Piso"
                                    type="number"
                                    value={filterPiso}
                                    onChange={(e) => setFilterPiso(e.target.value)}
                                />
                            </Box>
                        </Box>
                    </Box>


                    {/* Tabla */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Área</TableCell>
                                    <TableCell>Pabellón</TableCell>
                                    <TableCell>Piso</TableCell>
                                    <TableCell>Descripción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedData.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.area}</TableCell>
                                        <TableCell>{row.pabellon}</TableCell>
                                        <TableCell>{row.piso}</TableCell>
                                        <TableCell>{row.descripcion}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Container>
        </>
    );
}