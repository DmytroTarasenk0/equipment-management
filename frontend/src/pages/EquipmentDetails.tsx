import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import type { Equipment } from "../types";

const EquipmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [logDescription, setLogDescription] = useState("");
  const [newStatus, setNewStatus] = useState("Active");
  const [error, setError] = useState("");

  const fetchDetails = async () => {
    try {
      const response = await api.get(`/equipment/${id}`);
      setEquipment(response.data);
    } catch (err) {
      setError("Failed to fetch details.");
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleReportIssue = async () => {
    try {
      await api.post(`/equipment/${id}/report`);
      fetchDetails();
    } catch (err) {
      setError("Failed to report issue.");
    }
  };

  const handleLogMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/equipment/${id}/maintenance`, {
        description: logDescription,
        newStatus,
      });
      setLogDescription("");
      fetchDetails();
    } catch (err) {
      setError("Failed to log maintenance.");
    }
  };

  if (!equipment) return <div className="container">Loading details...</div>;

  return (
    <div className="container" style={{ maxWidth: "800px" }}>
      <button
        className="btn btn-outline"
        onClick={() => navigate("/")}
        style={{ marginBottom: "20px" }}
      >
        &larr; Back to Dashboard
      </button>

      {error && <div className="error-message">{error}</div>}

      <div className="card" style={{ marginBottom: "30px" }}>
        <div className="card-header">
          <h2>{equipment.name}</h2>
          <span
            className={`status-badge status-${equipment.status.toLowerCase()}`}
          >
            {equipment.status}
          </span>
        </div>
        <div className="card-body">
          <p>
            <strong>Serial Number:</strong> {equipment.serial_number}
          </p>
          <p>
            <strong>Next Maintenance:</strong>{" "}
            {new Date(equipment.next_maintenance).toLocaleDateString()}
          </p>
        </div>

        <div className="card-footer">
          <button
            className="btn btn-primary"
            onClick={handleReportIssue}
            style={{ backgroundColor: "var(--status-warning)", color: "#333" }}
          >
            Report Issue (Set to Warning)
          </button>
        </div>
      </div>

      {auth?.user?.role === "Engineer" && (
        <div
          className="card"
          style={{ marginBottom: "30px", backgroundColor: "#fdfdfd" }}
        >
          <h3>Engineer: Log Maintenance</h3>
          <form onSubmit={handleLogMaintenance}>
            <div className="form-group">
              <label>Maintenance Details</label>
              <textarea
                className="form-control"
                rows={3}
                value={logDescription}
                onChange={(e) => setLogDescription(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Update Status</label>
              <select
                className="form-control"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Warning">Warning</option>
                <option value="Decommissioned">Decommissioned</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit Log
            </button>
          </form>
        </div>
      )}

      <h3>Maintenance History</h3>
      {equipment.logs && equipment.logs.length > 0 ? (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {equipment.logs.map((log) => (
            <li
              key={log.id}
              style={{ padding: "15px", borderBottom: "1px solid #ccc" }}
            >
              <strong>{new Date(log.date).toLocaleDateString()}:</strong>{" "}
              {log.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No maintenance logs available for this equipment.</p>
      )}
    </div>
  );
};

export default EquipmentDetails;
