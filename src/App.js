import React from "react";

import LayoutAdmin from "./Pages/Admin/LayoutAdmin";
import Users from "./Pages/Admin/Users";
import Login from "./Pages/Login";
import Registro from "./Pages/Registro";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from "./Pages/Admin/Dashboard";
import Lockers from "./Pages/Admin/Lockers";
import Ubicacion from "./Pages/Admin/Ubicacion";
import Reportes from "./Pages/Admin/Reportes";
import LayoutUser from "./Pages/User/LayoutUser";
import MisLockers from "./Pages/User/MisLockers";

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

const viewsUser = {
  mislockers: <MisLockers />
};

export default function App() {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/usuario" element={<LayoutUser viewsUser={viewsUser}/>} />
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
