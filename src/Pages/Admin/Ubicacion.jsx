import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Ubicacion() {
  const [ubicaciones, setUbicaciones] = useState([
    { id: 1, nombre: "Edificio A", descripcion: "Primer piso, pasillo central", pabellon: "A", piso: 1 },
    { id: 2, nombre: "Edificio B", descripcion: "Segundo piso, junto a la cafetería", pabellon: "B", piso: 2 },
    { id: 3, nombre: "Gimnasio", descripcion: "Entrada principal", pabellon: "A", piso: 1 },
  ]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [pabellon, setPabellon] = useState("A");
  const [piso, setPiso] = useState(1);
  const [editId, setEditId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !descripcion || !pabellon || !piso) return;

    if (editId !== null) {
      setUbicaciones((prev) =>
        prev.map((u) =>
          u.id === editId ? { ...u, nombre, descripcion, pabellon, piso } : u
        )
      );
      setEditId(null);
    } else {
      const nuevaUbicacion = {
        id: Date.now(),
        nombre,
        descripcion,
        pabellon,
        piso,
      };
      setUbicaciones((prev) => [...prev, nuevaUbicacion]);
    }

    setNombre("");
    setDescripcion("");
    setPabellon("A");
    setPiso(1);
  };

  const handleEdit = (id) => {
    const ubicacion = ubicaciones.find((u) => u.id === id);
    if (!ubicacion) return;
    setEditId(ubicacion.id);
    setNombre(ubicacion.nombre);
    setDescripcion(ubicacion.descripcion);
    setPabellon(ubicacion.pabellon);
    setPiso(ubicacion.piso);
  };

  const handleDelete = (id) => {
    setUbicaciones((prev) => prev.filter((u) => u.id !== id));
    if (editId === id) {
      setEditId(null);
      setNombre("");
      setDescripcion("");
      setPabellon("A");
      setPiso(1);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-4 bg-dark text-light">
        <div className="card-body p-4">
          <h2 className="text-center mb-4 text-primary">
            <i className="bi bi-geo-alt-fill me-2"></i> Gestión de Ubicaciones de Lockers
          </h2>

          {/* Formulario */}
          <div className="border rounded-3 p-3 mb-4 bg-dark">
            <h5 className="mb-3">{editId ? "Editar Ubicación" : "Agregar Ubicación"}</h5>
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control bg-secondary text-light"
                  placeholder="Nombre de la ubicación"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control bg-secondary text-light"
                  placeholder="Descripción"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <select
                  className="form-control bg-secondary text-light"
                  value={pabellon}
                  onChange={(e) => setPabellon(e.target.value)}
                >
                  <option value="A">Pabellón A</option>
                  <option value="B">Pabellón B</option>
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-control bg-secondary text-light"
                  value={piso}
                  onChange={(e) => setPiso(Number(e.target.value))}
                >
                  {[...Array(15)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Piso {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2 d-grid">
                <button type="submit" className="btn btn-success">
                  <i className={`bi ${editId ? "bi-pencil-square" : "bi-plus-lg"} me-1`}></i>
                  {editId ? "Guardar" : "Agregar"}
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
                  <th>Descripción</th>
                  <th>Pabellón</th>
                  <th>Piso</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ubicaciones.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No hay ubicaciones registradas
                    </td>
                  </tr>
                ) : (
                  ubicaciones.map((ubicacion) => (
                    <tr key={ubicacion.id}>
                      <td>{ubicacion.id}</td>
                      <td>{ubicacion.nombre}</td>
                      <td>{ubicacion.descripcion}</td>
                      <td>
                        <span className={`badge ${ubicacion.pabellon === "A" ? "bg-info" : "bg-warning text-dark"}`}>
                          {ubicacion.pabellon}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-secondary">{ubicacion.piso}</span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(ubicacion.id)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(ubicacion.id)}
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