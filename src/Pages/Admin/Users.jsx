import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Users() {
  const [users, setUsers] = useState([
    { id: 1, nombre: "Juan", apellido: "Zarate", correo: "juan@correo.com", rol: "Admin" },
    { id: 2, nombre: "María", apellido: "Vargas", correo: "maria@correo.com", rol: "Usuario" },
    { id: 3, nombre: "Carlos", apellido: "Repudio", correo: "carlos@correo.com", rol: "Usuario" },
  ]);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("Usuario");
  const [editId, setEditId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !apellido || !correo) return;

    if (editId !== null) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editId ? { ...u, nombre, apellido, correo, rol } : u
        )
      );
      setEditId(null);
    } else {
      const newUser = {
        id: Date.now(),
        nombre,
        apellido,
        correo,
        rol,
      };
      setUsers((prev) => [...prev, newUser]);
    }

    setNombre("");
    setApellido("");
    setCorreo("");
    setRol("Usuario");
  };

  const handleEdit = (id) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    setEditId(user.id);
    setNombre(user.nombre);
    setApellido(user.apellido);
    setCorreo(user.correo);
    setRol(user.rol);
  };

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (editId === id) {
      setEditId(null);
      setNombre("");
      setApellido("");
      setCorreo("");
      setRol("Usuario");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-4 bg-dark text-light">
        <div className="card-body p-4">
          <h2 className="text-center mb-4 text-primary">
            <i className="bi bi-people-fill me-2"></i> Gestión de Usuarios
          </h2>

          {/* Formulario */}
          <div className="border rounded-3 p-3 mb-4 bg-dark">
            <h5 className="mb-3">
              {editId ? "Editar Usuario" : ""}
            </h5>
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control bg-secondary text-light"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control bg-secondary text-light"
                  placeholder="Apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="email"
                  className="form-control bg-secondary text-light"
                  placeholder="Correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <select
                  className="form-control bg-secondary text-light"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                >
                  <option value="Admin">Admin</option>
                  <option value="Usuario">Usuario</option>
                </select>
              </div>
              <div className="col-md-1 d-grid">
                <button type="submit" className="btn btn-success">
                  <i className="bi bi-save"></i>
                </button>
              </div>
            </form>
          </div>

          {/* Tabla */}
          <div className="table-responsive">
            <table className="table table-hover align-middle table-dark text-light">
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No hay usuarios registrados
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.nombre}</td>
                      <td>{user.apellido}</td>
                      <td>{user.correo}</td>
                      <td>
                        <span
                          className={`badge px-3 py-2 ${
                            user.rol === "Admin" ? "bg-primary" : "bg-secondary"
                          }`}
                        >
                          {user.rol}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(user.id)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(user.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

