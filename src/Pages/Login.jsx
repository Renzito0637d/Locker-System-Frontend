import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Paper, Typography, Box, Alert, CircularProgress } from "@mui/material";
import { getMe, login } from "../lib/auth";

export default function Login() {

    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // 1️⃣ Login: envía credenciales al backend
            await login(userName, password);

            // 2️⃣ Obtener información del usuario autenticado
            const user = await getMe();
            const roles = user.roles || [];

            // 3️⃣ Redirección según rol
            if (roles.includes("ROLE_ADMIN")) navigate("/admin");
            else if (roles.includes("ROLE_ESTUDIANTE") || roles.includes("ROLE_ESTUDIANTE"))
                navigate("/usuario");
            else navigate("/");

        } catch (err) {
            console.error(err);
            setError("Usuario o contraseña incorrectos");
        } finally {
            setLoading(false);
        }
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

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Usuario"
                        margin="normal"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Contraseña"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2, py: 1.2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
                    </Button>
                </form>
                <Button onClick={() => navigate("/registro")} fullWidth sx={{ mt: 1 }}>
                    ¿No tienes cuenta? Regístrate
                </Button>
            </Paper>
        </Box>
    );
}