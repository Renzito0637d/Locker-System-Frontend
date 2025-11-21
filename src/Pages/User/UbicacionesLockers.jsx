import { useEffect, useMemo, useState } from "react";
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
    CircularProgress,
} from "@mui/material";
import { getUbicaciones } from "../../services/UbicacionService";

export default function UbicacionesLockers() {

    const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Estados para filtros y ordenamiento
  const [sortBy, setSortBy] = useState("id");
  const [filterPabellon, setFilterPabellon] = useState("");
  const [filterPiso, setFilterPiso] = useState("");

  // 3. Cargar datos al montar
  useEffect(() => {
    getUbicaciones()
      .then((data) => {
        // Validación de seguridad por si el backend falla
        if (Array.isArray(data)) setUbicaciones(data);
        else setUbicaciones([]);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // 4. Lógica de Filtrado y Ordenamiento (useMemo para eficiencia)
  const sortedData = useMemo(() => {
    let data = [...ubicaciones];

    // A. FILTRAR
    if (filterPabellon) {
      // Compara ignorando mayúsculas/minúsculas
      data = data.filter((u) => 
        u.pabellon.toLowerCase() === filterPabellon.toLowerCase()
      );
    }
    if (filterPiso) {
      // Filtro flexible (coincidencia parcial)
      data = data.filter((u) => 
        u.piso.toString().toLowerCase().includes(filterPiso.toLowerCase())
      );
    }

    // B. ORDENAR
    data.sort((a, b) => {
      if (sortBy === "id") {
        return a.id - b.id;
      }
      if (sortBy === "pabellon") {
        return a.pabellon.localeCompare(b.pabellon);
      }
      if (sortBy === "piso") {
        // Ordenamiento numérico inteligente ("Piso 2" antes que "Piso 10")
        return a.piso.localeCompare(b.piso, undefined, { numeric: true });
      }
      return 0;
    });

    return data;
  }, [ubicaciones, filterPabellon, filterPiso, sortBy]);

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Ubicaciones Disponibles
      </Typography>

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
            <FormControl sx={{ minWidth: 150 }} size="small">
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
              Filtrar por
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel>Pabellón</InputLabel>
                <Select
                  value={filterPabellon}
                  onChange={(e) => setFilterPabellon(e.target.value)}
                  label="Pabellón"
                >
                  <MenuItem value=""><em>Todos</em></MenuItem>
                  {/* Generamos opciones dinámicas basadas en lo que hay en BD, o estáticas */}
                  <MenuItem value="A">A</MenuItem>
                  <MenuItem value="B">B</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Piso"
                size="small"
                value={filterPiso}
                onChange={(e) => setFilterPiso(e.target.value)}
                placeholder="Ej: 2"
              />
            </Box>
          </Box>
        </Box>

        {/* Tabla */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Edificio</TableCell> {/* Cambié Área por Edificio */}
                <TableCell>Pabellón</TableCell>
                <TableCell>Piso</TableCell>
                <TableCell>Descripción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.length > 0 ? (
                sortedData.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.nombreEdificio}</TableCell> {/* Ojo: nombreEdificio, no area */}
                    <TableCell>{row.pabellon}</TableCell>
                    <TableCell>{row.piso}</TableCell>
                    <TableCell>{row.descripcion}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No se encontraron ubicaciones con esos filtros.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}