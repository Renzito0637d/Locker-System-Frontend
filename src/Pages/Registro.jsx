import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Paper, Typography, Box } from "@mui/material";

export default function Registro() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica de registrar usuario
        navigate("/"); // Vuelve al login después de registrar
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Paper elevation={3} sx={{ p: 4, width: 350 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Registrarse para reservar lockers
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField label="Nombre completo" fullWidth margin="normal" required />
                    <TextField label="Correo universitario" type="email" fullWidth margin="normal" required />
                    <TextField label="Usuario" fullWidth margin="normal" required />
                    <TextField label="Contraseña" type="password" fullWidth margin="normal" required />
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                        Registrar
                    </Button>
                </form>
                <Button onClick={() => navigate("/")} fullWidth sx={{ mt: 1 }}>
                    ¿Ya tienes cuenta? Inicia sesión
                </Button>
            </Paper>
        </Box>
    );
}
