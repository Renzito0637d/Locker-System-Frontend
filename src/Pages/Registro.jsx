import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Paper, Typography, Box, Alert } from "@mui/material";
import { registerEstudiante } from "../lib/auth";

export default function Registro() {
    const navigate = useNavigate();
    
    // 1. Estado para los datos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        userName: '',
        password: ''
    });

    const [error, setError] = useState(null);

    // 2. Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 3. Enviar datos al backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            await registerEstudiante(formData);
            // Si es exitoso, redirigir al login
            alert("Registro exitoso. Por favor inicia sesión.");
            navigate("/"); 
        } catch (err) {
            console.error(err);
            // Manejo básico de error (puedes mejorarlo según la respuesta de tu backend)
            setError("Error al registrar. Verifica los datos o intenta más tarde.");
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Paper elevation={3} sx={{ p: 4, width: 350 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Registrarse para reservar lockers
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField 
                        label="Nombre" 
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        fullWidth margin="normal" required 
                    />
                    <TextField 
                        label="Apellido" 
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        fullWidth margin="normal" required 
                    />
                    <TextField 
                        label="Correo universitario" 
                        name="email" // Debe coincidir con el DTO de Java
                        type="email" 
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth margin="normal" required 
                    />
                    <TextField 
                        label="Usuario" 
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        fullWidth margin="normal" required 
                    />
                    <TextField 
                        label="Contraseña" 
                        name="password"
                        type="password" 
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth margin="normal" required 
                    />
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
