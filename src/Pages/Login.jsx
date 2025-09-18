import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Paper, Typography, Box } from "@mui/material";

export default function Login() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí va la validación
        navigate("/usuario"); // Redirige al panel admin después de login
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Paper elevation={3} sx={{ p: 4, width: 350 }}>

                <Box display="flex" justifyContent="center">
                    <Box
                        component="img"
                        src="https://sercodesac.com/wp-content/uploads/2024/10/Logo-UTP-300x300.png"   // pon la ruta de tu logo (carpeta public en React)
                        alt="Logo"
                        sx={{ height: 160 }}
                    />
                </Box>

                <Typography variant="h5" align="center" gutterBottom>
                    Iniciar sesión
                </Typography>
                <Typography variant="h6" align="center" gutterBottom>
                    Reserva de Lockers
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label="Usuario" margin="normal" required />
                    <TextField fullWidth label="Contraseña" type="password" margin="normal" required />
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                        Entrar
                    </Button>
                </form>
                <Button onClick={() => navigate("/registro")} fullWidth sx={{ mt: 1 }}>
                    ¿No tienes cuenta? Regístrate
                </Button>
            </Paper>
        </Box>
    );
}