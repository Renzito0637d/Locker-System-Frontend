import * as React from "react";
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, TextField, MenuItem, } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";


const columns = [
    { id: "id", label: "ID", minWidth: 50 },
    { id: "nombre", label: "Nombre", minWidth: 150 },
    { id: "ubicacion", label: "Ubicación", minWidth: 100 },
    { id: "fechaInicio", label: "Fecha Inicio", minWidth: 170 },
    { id: "fechaFin", label: "Fecha Fin", minWidth: 170 },
];

// Datos de ejemplo (con fecha y hora)
const rows = [
    {
        id: 1,
        nombre: "Locker A",
        ubicacion: "A03",
        fechaInicio: "2025-09-16 08:30",
        fechaFin: "2025-09-20 18:00",
    },
    {
        id: 2,
        nombre: "Locker B",
        ubicacion: "B12",
        fechaInicio: "2025-09-18 09:00",
        fechaFin: "2025-09-25 17:30",
    },
    {
        id: 3,
        nombre: "Locker C",
        ubicacion: "C07",
        fechaInicio: "2025-09-19 10:15",
        fechaFin: "2025-09-22 16:45",
    },
    {
        id: 4,
        nombre: "Locker A",
        ubicacion: "A03",
        fechaInicio: "2025-09-16 08:30",
        fechaFin: "2025-09-20 18:00",
    },
    {
        id: 5,
        nombre: "Locker B",
        ubicacion: "B12",
        fechaInicio: "2025-09-18 09:00",
        fechaFin: "2025-09-25 17:30",
    },
    {
        id: 6,
        nombre: "Locker C",
        ubicacion: "C07",
        fechaInicio: "2025-09-19 10:15",
        fechaFin: "2025-09-22 16:45",
    },
    {
        id: 7,
        nombre: "Locker A",
        ubicacion: "A03",
        fechaInicio: "2025-09-16 08:30",
        fechaFin: "2025-09-20 18:00",
    },
    {
        id: 8,
        nombre: "Locker B",
        ubicacion: "B12",
        fechaInicio: "2025-09-18 09:00",
        fechaFin: "2025-09-25 17:30",
    },
    {
        id: 9,
        nombre: "Locker C",
        ubicacion: "C07",
        fechaInicio: "2025-09-19 10:15",
        fechaFin: "2025-09-22 16:45",
    },
    {
        id: 10,
        nombre: "Locker A",
        ubicacion: "A03",
        fechaInicio: "2025-09-16 08:30",
        fechaFin: "2025-09-20 18:00",
    },
    {
        id: 11,
        nombre: "Locker B",
        ubicacion: "B12",
        fechaInicio: "2025-09-18 09:00",
        fechaFin: "2025-09-25 17:30",
    },
    {
        id: 12,
        nombre: "Locker C",
        ubicacion: "C07",
        fechaInicio: "2025-09-19 10:15",
        fechaFin: "2025-09-22 16:45",
    },
];

export default function MisLockers() {

    const [sortField, setSortField] = React.useState("id");
    const [startDate, setStartDate] = React.useState(null);
    const [endDate, setEndDate] = React.useState(null);

    // Función de filtrado
    const filteredRows = rows.filter((row) => {
        const inicio = dayjs(row.fechaInicio);
        const fin = dayjs(row.fechaFin);

        const dateMatch =
            (!startDate || inicio.isAfter(startDate) || inicio.isSame(startDate)) &&
            (!endDate || fin.isBefore(endDate) || fin.isSame(endDate));

        return dateMatch;
    });

    // Ordenar según campo seleccionado
    const sortedRows = [...filteredRows].sort((a, b) => {
        if (sortField === "id") {
            return a.id - b.id;
        }
        return a[sortField].localeCompare(b[sortField]);
    });

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

            <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
                {/* Ordenar por */}
                <TextField
                    select
                    label="Ordenar por"
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem value="id">ID</MenuItem>
                    <MenuItem value="nombre">Nombre</MenuItem>
                    <MenuItem value="ubicacion">Ubicación</MenuItem>
                </TextField>
                {/* Filtros de fecha */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="Filtrar fecha inicio"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        slotProps={{ textField: { sx: { minWidth: 220 } } }}
                    />
                    <DateTimePicker
                        label="Filtrar Fecha fin"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        slotProps={{ textField: { sx: { minWidth: 220 } } }}
                    />
                </LocalizationProvider>
            </Box>

            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="tabla mis lockers">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    sx={{
                                        minWidth: column.minWidth,
                                        fontWeight: "bold",
                                        backgroundColor: "#212121",
                                        color: "#fff"
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedRows.map((row) => (
                            <TableRow hover tabIndex={-1} key={row.id}>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    return <TableCell key={column.id}>{value}</TableCell>;
                                })}
                            </TableRow>
                        ))}
                        {sortedRows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    No se encontraron lockers
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
