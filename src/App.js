import React from "react";

import LayoutAdmin from "./Pages/Admin/LayoutAdmin";
import Users from "./Pages/Admin/Users";
import Login from "./Pages/Login";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from "./Pages/Admin/Dashboard";
import Lockers from "./Pages/Admin/Lockers";
import Ubicacion from "./Pages/Admin/Ubicacion";
import Reportes from "./Pages/Admin/Reportes";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const views = {
  inicio: <Dashboard />,
  usuarios: <Users />,
  lockers: <Lockers />,
  ubicacion: <Ubicacion />,
  reportes: <Reportes />,
};

export default function App() {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            {/* <Route path="/registro" element={<Registro />} /> */}
            {/* <Route path="/usuariodashboard" element={<Home? />} /> */}
            <Route path="/admin" element={<LayoutAdmin views={views} />} />
            {/* Ruta por defecto si no encuentra coincidencias */}
            <Route path="*" element={
              <h2>404 - Página no encontrada</h2>
            }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}
