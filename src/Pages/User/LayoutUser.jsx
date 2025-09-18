import * as React from "react";
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
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import { Avatar, Button } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useNavigate } from "react-router-dom";
import { EventAvailable } from "@mui/icons-material";

const user = {
  name: "Luis Sánchez",
  email: "luis.sanchez@gmail.com",
  avatar: "https://img.freepik.com/psd-gratis/ilustracion-3d-avatar-o-perfil-humano_23-2150671122.jpg",
};

const drawerWidth = 240;

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

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

/**
 * Menu del USUARIO para navegar entre componentes
 */
export default function LayoutUser({ viewsUser }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  // clave actual (vista1 | vista2 | vista3)
  const [currentView, setCurrentView] = React.useState("mislockers");

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // Opciones del menú
  const menuItems = [
    { key: "mislockers", label: "Mis Lockers", icon: <Inventory2RoundedIcon /> },
    { key: "reservas", label: "Reservar locker", icon: <EventAvailable /> },
    { key: "misreportes", label: "Reportar locker", icon: <ReportProblemRoundedIcon /> },
  ];

  const navigate = useNavigate();

  // Render principal
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              { marginRight: 5 },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Panel de administrador — {menuItems.find(m => m.key === currentView)?.label}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>

        <Divider />

        <List>
          {menuItems.map(({ key, label, icon }) => (
            <ListItem key={key} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => setCurrentView(key)}
                selected={currentView === key}
                sx={[
                  { minHeight: 48, px: 2.5 },
                  open ? { justifyContent: "initial" } : { justifyContent: "center" },
                ]}
              >
                <ListItemIcon
                  sx={[
                    { minWidth: 0, justifyContent: "center" },
                    open ? { mr: 3 } : { mr: "auto" },
                  ]}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />

        {/* Cuenta estática pegada abajo */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            p: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              justifyContent: open ? "flex-start" : "center",
            }}
          >
            <Avatar src={user.avatar} alt={user.name}>
              {!user.avatar && (user.name?.[0] || "U")}
            </Avatar>

            {open && (
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body1" fontWeight={600} noWrap>
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {user.email}
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ mt: 1.5, display: "flex", gap: 1 }}>
            {open ? (
              <Button
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<LogoutRoundedIcon />}
                onClick={() => navigate("/")}
              >
                Cerrar sesión
              </Button>
            ) : (
              <IconButton
                color="inherit"
                size="small"
                onClick={() => navigate("/")}
                sx={{ mx: "auto", display: "block" }}
                aria-label="Cerrar sesión"
              >
                <LogoutRoundedIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {/* Contenido dinámico según la vista */}
        {viewsUser?.[currentView] ?? (
          <Typography color="text.secondary">
            Selecciona una vista desde el menú.
          </Typography>
        )}
      </Box>
    </Box>
  );
}