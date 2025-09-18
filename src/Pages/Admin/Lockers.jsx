import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Lockers() {
  // Cargar datos desde localStorage al iniciar
  const [lockers, setLockers] = useState(() => {
    const saved = localStorage.getItem("lockers");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, numero: "A01", estado: "Disponible" },
          { id: 2, numero: "B02", estado: "Ocupado" },
          { id: 3, numero: "A15", estado: "Disponible" },
        ];
  });

  // Guardar en localStorage cada vez que cambie lockers
  useEffect(() => {
    localStorage.setItem("lockers", JSON.stringify(lockers));
  }, [lockers]);

  const [numero, setNumero] = useState("");
  const [estado, setEstado] = useState("Disponible");
  const [editId, setEditId] = useState(null);

  // Extrae pabellón y piso del número (ej: "A15" => "A", 15)
  const getUbicacion = (numero) => {
    if (!numero || numero.length < 2) return "";
    const pabellon = numero[0].toUpperCase();
    const piso = parseInt(numero.slice(1), 10);
    if (isNaN(piso)) return `Pabellón ${pabellon}`;
    return `Pabellón ${pabellon}, Piso ${piso}`;
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  if (!numero || numero.length < 2) return;

  if (editId !== null) {
    setLockers((prev) =>
      prev.map((l) =>
        l.id === editId ? { ...l, numero, estado } : l
      )
    );
    setEditId(null);
  } else {
    // Calcula el siguiente ID correlativo
    const nextId = lockers.length > 0 ? Math.max(...lockers.map(l => l.id)) + 1 : 1;
    const newLocker = {
      id: nextId,
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
                  placeholder="Número de Locker (ej: A01, B15)"
                  value={numero}
                  maxLength={3}
                  onChange={(e) => {
                    // Solo permite formato letra+números, ej: A01, B15
                    let val = e.target.value.toUpperCase();
                    val = val.replace(/[^A-B0-9]/g, "");
                    if (val.length > 0) {
                      val = val[0].replace(/[^A-B]/, "") + val.slice(1, 3).replace(/[^0-9]/g, "");
                    }
                    setNumero(val.slice(0, 3));
                  }}
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
                  <th>Ubicación</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lockers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No hay lockers registrados
                    </td>
                  </tr>
                ) : (
                  lockers.map((locker) => (
                    <tr key={locker.id}>
                      <td>{locker.id}</td>
                      <td>{locker.numero}</td>
                      <td>{getUbicacion(locker.numero)}</td>
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