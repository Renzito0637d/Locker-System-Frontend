import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// Iconos específicos de Admin
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import { EventAvailable } from "@mui/icons-material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { Avatar, Button, CircularProgress, Dialog, DialogActions, DialogTitle, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getMe, logout } from "../../lib/auth";

const drawerWidth = 240;

// --- ESTILOS SOLO PARA ESCRITORIO (ANIMACIONES) ---
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

// AppBar que se mueve solo en escritorio
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Drawer Desktop (Con animación compleja)
const DesktopDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  })
);

/**
 * Menu de ADMINISTRADOR para navegar entre componentes
 */
export default function LayoutAdmin({ views }) {
  const theme = useTheme();
  // Detectar si es pantalla pequeña (Móvil/Tablet vertical)
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Estados separados para móvil y escritorio
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  const [currentView, setCurrentView] = useState("inicio");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // --- HANDLERS ---
  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const handleMenuClick = (key) => {
    setCurrentView(key);
    if (isMobile) setMobileOpen(false); // Cerrar menú automáticamente en celular
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  useEffect(() => {
    getMe()
      .then((data) => {
        const fullName = `${data.userName}+${data.apellido}`;
        const avatarUrl = `https://ui-avatars.com/api/?name=${fullName}&background=random&color=fff&size=128`;
        setUser({
          name: `${data.userName} ${data.apellido}`,
          email: data.email,
          avatar: avatarUrl,
        });
      })
      .catch((err) => {
        console.error("Error obteniendo usuario", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  if (!user) return null;

  // Opciones del menú (ADMIN)
  const menuItems = [
    { key: "inicio", label: "Inicio", icon: <HomeRoundedIcon /> },
    { key: "usuarios", label: "Usuarios", icon: <PeopleAltRoundedIcon /> },
    { key: "lockers", label: "Lockers", icon: <Inventory2RoundedIcon /> },
    { key: "ubicacion", label: "Ubicaciones", icon: <PlaceRoundedIcon /> },
    { key: "reportes", label: "Reportes", icon: <ReportProblemRoundedIcon /> },
    { key: "reservas", label: "Reservas", icon: <EventAvailable /> }
  ];

  // --- CONTENIDO COMÚN DEL DRAWER ---
  const drawerContent = (isOpenOrMobile) => (
    <>
      <DrawerHeader>
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
        {isMobile && (
          <Typography variant="subtitle1" sx={{ width: '100%', textAlign: 'center', fontWeight: 'bold' }}>
            ADMIN
          </Typography>
        )}
      </DrawerHeader>

      <Divider />

      <List>
        {menuItems.map(({ key, label, icon }) => (
          <ListItem key={key} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => handleMenuClick(key)}
              selected={currentView === key}
              sx={[
                { minHeight: 48, px: 2.5 },
                isOpenOrMobile ? { justifyContent: "initial" } : { justifyContent: "center" },
              ]}
            >
              <ListItemIcon
                sx={[
                  { minWidth: 0, justifyContent: "center" },
                  isOpenOrMobile ? { mr: 3 } : { mr: "auto" },
                ]}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                sx={[isOpenOrMobile ? { opacity: 1 } : { opacity: 0 }]}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <Box
        sx={{
          position: "absolute",
          left: 0, right: 0, bottom: 0,
          p: 2,
          borderTop: 1, borderColor: "divider",
          backgroundColor: "background.paper"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, justifyContent: isOpenOrMobile ? "flex-start" : "center", mb: 1 }}>
          <Avatar src={user.avatar} alt={user.name} sx={{ width: 40, height: 40 }}>
            {!user.avatar && (user.name?.[0] || "U")}
          </Avatar>
          {isOpenOrMobile && (
            <Box sx={{ minWidth: 0, overflow: "hidden" }}>
              <Typography variant="body1" fontWeight={600} noWrap>{user.name}</Typography>
              <Typography variant="body2" color="text.secondary" noWrap>{user.email}</Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: isOpenOrMobile ? "flex-start" : "center" }}>
          {isOpenOrMobile ? (
            <Button variant="outlined" size="small" fullWidth startIcon={<LogoutRoundedIcon />} onClick={() => setConfirmOpen(true)}>
              Cerrar sesión
            </Button>
          ) : (
            <IconButton color="inherit" size="small" onClick={() => setConfirmOpen(true)}>
              <LogoutRoundedIcon />
            </IconButton>
          )}
        </Box>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* APP BAR RESPONSIVE */}
      <AppBar
        position="fixed"
        open={desktopOpen} // En escritorio, reacciona a desktopOpen
        sx={{
          // En móvil, el AppBar SIEMPRE ocupa el 100%
          width: { xs: '100%', sm: desktopOpen ? `calc(100% - ${drawerWidth}px)` : `calc(100% - calc(${theme.spacing(8)} + 1px))` },
          ml: { xs: 0, sm: desktopOpen ? `${drawerWidth}px` : `calc(${theme.spacing(8)} + 1px)` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{
              marginRight: 5,
              // Ocultar botón menú SÓLO en escritorio cuando está abierto
              display: { xs: 'block', sm: desktopOpen ? 'none' : 'block' }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Panel de administrador — {menuItems.find(m => m.key === currentView)?.label}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* DRAWER 1: MÓVIL (Temporary) */}
      <MuiDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" }, // SOLO visible en XS
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawerContent(true)}
      </MuiDrawer>

      {/* DRAWER 2: ESCRITORIO (Permanent + Animated) */}
      <DesktopDrawer
        variant="permanent"
        open={desktopOpen}
        sx={{
          display: { xs: "none", sm: "block" }, // SOLO visible en SM o superior
        }}
      >
        {drawerContent(desktopOpen)}
      </DesktopDrawer>

      {/* CONTENIDO PRINCIPAL */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: "100%" }}>
        <DrawerHeader />
        {views?.[currentView] ?? (
          <Typography color="text.secondary">
            Selecciona una vista desde el menú.
          </Typography>
        )}
      </Box>

      {/* DIALOGO LOGOUT */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>{"¿Cerrar sesión?"}</DialogTitle>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} disabled={loading}>Cancelar</Button>
          <Button onClick={handleLogout} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={18} color="inherit" /> : "Sí, salir"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}