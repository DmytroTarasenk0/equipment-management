import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const AddEquipment: React.FC = () => {
  const [name, setName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [nextMaintenance, setNextMaintenance] = useState("");
  const [error, setError] = useState("");

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // security check on the UI side
  if (auth?.user?.role !== "Admin") {
    return <div className="container">Access Denied. Admins only.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/equipment", {
        name,
        serial_number: serialNumber,
        next_maintenance: nextMaintenance,
      });
      navigate("/"); // return to dashboard on success
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add equipment.");
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Equipment</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Equipment Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Serial Number</label>
          <input
            type="text"
            className="form-control"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Next Maintenance Date</label>
          <input
            type="date"
            className="form-control"
            value={nextMaintenance}
            onChange={(e) => setNextMaintenance(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Save Equipment
        </button>
      </form>
    </div>
  );
};

export default AddEquipment;
