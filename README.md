# Sistema de lockers - Frontend

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![Jira](https://img.shields.io/badge/jira-%230A0FFF.svg?style=for-the-badge&logo=jira&logoColor=white)

---

App web frontend para un sistema de lockers para la UTP sede norte que permita a los estudiantes y administradores asignar, liberar y monitorear lockers de manera segura, ordenada y eficiente.

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

| RF   | Descripcion                                                                                                   | Estado        |
| ---- | ------------------------------------------------------------------------------------------------------------- | ------------- |
| RF01 | El sistema debe permitir registrar nuevos lockers con datos como ubicación, número o código identificador.    | :alarm_clock: |
| RF02 | El sistema debe permitir actualizar la información de un locker (ubicación, estado, etc.)                     | :alarm_clock: |
| RF03 | El sistema debe permitir cambiar el estado de un locker a: disponible, ocupado, en mantenimiento.             | :alarm_clock: |
| RF04 | El sistema debe mostrar una lista o tablero con todos los lockers y sus estados actuales.                     | :alarm_clock: |
| RF05 | El sistema debe permitir filtrar lockers por estado (disponible, ocupado, mantenimiento).                     | :alarm_clock: |
| RF06 | Los usuarios (estudiantes o personal autorizado) deben poder solicitar la asignación de un locker disponible. | :alarm_clock: |
| RF07 | El sistema debe asignar un locker disponible al usuario y cambiar el estado del locker a “ocupado”.           | :alarm_clock: |
| RF08 | El sistema debe permitir que un usuario libere un locker cuando ya no lo use.                                 | :alarm_clock: |
| RF09 | El sistema debe actualizar el estado del locker a “disponible” una vez liberado.                              | :alarm_clock: |
| RF10 | El sistema debe permitir registrar usuarios con roles (usuario o administrador).                              | :alarm_clock: |
| RF11 | El sistema debe permitir iniciar sesión y autenticarse según el rol del usuario.                              | :alarm_clock: |
| RF12 | Los usuarios deben poder ver los lockers asignados a ellos.                                                   | :alarm_clock: |
| RF13 | Los administradores deben poder administrar los permisos y roles de los usuarios.                             | :alarm_clock: |
