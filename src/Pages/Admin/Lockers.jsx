import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Lockers() {
  const [lockers, setLockers] = useState([
    { id: 1, numero: "A101", estado: "Disponible" },
    { id: 2, numero: "A102", estado: "Ocupado" },
    { id: 3, numero: "A103", estado: "Disponible" },
  ]);
  const [numero, setNumero] = useState("");
  const [estado, setEstado] = useState("Disponible");
  const [editId, setEditId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!numero) return;

    if (editId !== null) {
      setLockers((prev) =>
        prev.map((l) =>
          l.id === editId ? { ...l, numero, estado } : l
        )
      );
      setEditId(null);
    } else {
      const newLocker = {
        id: Date.now(),
        numero,
        estado,
      };
      setLockers((prev) => [...prev, newLocker]);
    }

    setNumero("");
    setEstado("Disponible");
  };

  const handleEdit = (id) => {
    const locker = lockers.find((l) => l.id === id);
    if (!locker) return;
    setEditId(locker.id);
    setNumero(locker.numero);
    setEstado(locker.estado);
  };

  const handleDelete = (id) => {
    setLockers((prev) => prev.filter((l) => l.id !== id));
    if (editId === id) {
      setEditId(null);
      setNumero("");
      setEstado("Disponible");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-4 bg-dark text-light">
        <div className="card-body p-4">
          <h2 className="text-center mb-4 text-primary">
            <i className="bi bi-box-seam me-2"></i> Gestión de Lockers
          </h2>

          {/* Formulario */}
          <div className="border rounded-3 p-3 mb-4 bg-dark">
            <h5 className="mb-3">{editId ? "Editar Locker" : "Agregar Locker"}</h5>
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control bg-secondary text-light"
                  placeholder="Número de Locker"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </div>
              <div className="col-md-5">
                <select
                  className="form-control bg-secondary text-light"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Ocupado">Ocupado</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                </select>
              </div>
              <div className="col-md-2 d-grid">
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
                  <th>Número</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lockers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No hay lockers registrados
                    </td>
                  </tr>
                ) : (
                  lockers.map((locker) => (
                    <tr key={locker.id}>
                      <td>{locker.id}</td>
                      <td>{locker.numero}</td>
                      <td>
                        <span
                          className={`badge px-3 py-2 ${
                            locker.estado === "Disponible"
                              ? "bg-success"
                              : locker.estado === "Ocupado"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {locker.estado}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(locker.id)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(locker.id)}
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