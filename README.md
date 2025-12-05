# Sistema de lockers - Frontend

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![Jira](https://img.shields.io/badge/jira-%230A0FFF.svg?style=for-the-badge&logo=jira&logoColor=white)

---

App web frontend para un sistema de lockers para la UTP sede norte que permita a los estudiantes y administradores asignar, liberar y monitorear lockers de manera segura, ordenada y eficiente.

---

El backend de esta aplicación se encuentra en un repositorio separado: [Link al repositorio del Frontend](https://github.com/Renzito0637d/Locker-System-Backend)


## Proyecto desplegado en render:
- **Frontend**: https://locker-system-frontend.onrender.com 
- **Backend**: https://locker-system-backendv2.onrender.com 

---

# 🚀 Instrucciones para clonar y ejecutar el proyecto React

### 1. Clonar el repositorio

Abre tu terminal y ejecuta:

```
git clone https://github.com/Renzito0637d/Locker-System-Frontend.git
```

Después entra a la carpeta del proyecto:

```
cd Locker-System-Frontend
```

```
cd nombre-del-proyecto
```

### 2. Instalar dependencias

```
npm install
```

### 3. Ejecutar

Para levantar el servidor local:

```
npm start
```

La app se abrirá en http://localhost:3000

## Lista de requerimientos funcionales

| RF   | Descripcion | Estado |
|------|-------------|--------|
| RF01 |El sistema debe permitir hacer un mantenimiento de lockers con datos como ubicación, número o código identificador.|:heavy_check_mark:|
| RF02 | El sistema debe permitir hacer un mantenimiento de ubicacion.|:heavy_check_mark:|
| RF03 | El sistema debe permitir cambiar el estado de un locker a: disponible, ocupado, en mantenimiento. |:heavy_check_mark:|
| RF04 |El sistema debe mostrar una lista o tablero con todos los lockers y sus estados actuales. |:heavy_check_mark:|
| RF05   |El sistema debe permitir filtrar lockers por estado (disponible, ocupado, mantenimiento). |:heavy_check_mark:|
| RF06  |Los estudiantes deben poder solicitar la asignación de un locker disponible.|:heavy_check_mark:|
| RF07 |El sistema debe asignar un locker disponible al usuario y cambiar el estado del locker a “ocupado”. |:heavy_check_mark:|
| RF08   |El sistema debe permitir que un usuario libere un locker cuando ya no lo use. |:heavy_check_mark:|
| RF09   |El sistema debe actualizar el estado del locker a “disponible” una vez liberado. |:heavy_check_mark:|
| RF10   |El sistema debe permitir al administrador hacer un mantenimiento de los usuarios.|:alarm_clock:|
| RF11   | El sistema debe permitir iniciar sesión y autenticarse según el rol del usuario. |:heavy_check_mark:|
| RF12   |  El sistema debe proteger el acceso a funciones administrativas mediante autenticación y autorización. |:heavy_check_mark:|
| RF13   | Los usuarios deben poder ver los lockers asignados a ellos. |:heavy_check_mark:|
| RF14   | El sistema debe mostrar las reservas del locker del usuario.|:alarm_clock:|
| RF15   | Los usuarios deben poder reportar (mantenimiento) problemas o fallas en un locker. |:alarm_clock:|
| RF16   | El sistema debe poder hacer informes del reporte de lockers a mantenimiento.|:alarm_clock:|
| RF17   | Los administradores deben poder actualizar el estado de la orden de mantenimiento (pendiente, en proceso, resuelto) del reporte. |:alarm_clock:|

