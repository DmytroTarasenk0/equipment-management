import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import type { Equipment } from "../types";

const Dashboard: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await api.get("/equipment");
        setEquipmentList(response.data);
      } catch (err) {
        setError("Failed to load equipment catalogue.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Active":
        return "status-active";
      case "Warning":
        return "status-warning";
      case "Maintenance":
        return "status-maintenance";
      case "Decommissioned":
        return "status-decommissioned";
      default:
        return "status-decommissioned";
    }
  };

  if (loading) return <div>Loading catalogue...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Equipment Catalogue</h2>
        {auth?.user?.role === "Admin" && (
          <button
            className="btn btn-primary"
            style={{ width: "auto" }}
            onClick={() => navigate("/add-equipment")}
          >
            + Add New Equipment
          </button>
        )}
      </div>

      {equipmentList.length === 0 ? (
        <p>No equipment found in the database.</p>
      ) : (
        <div className="equipment-grid">
          {equipmentList.map((item) => (
            <article key={item.id} className="card">
              <div className="card-header">
                <h3>{item.name}</h3>
                <span className={`status-badge ${getStatusClass(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <div className="card-body">
                <p>
                  <strong>Serial:</strong> {item.serial_number}
                </p>
                <p>
                  <strong>Next Maintenance:</strong>{" "}
                  {new Date(item.next_maintenance).toLocaleDateString()}
                </p>
              </div>
              <div className="card-footer">
                <button
                  className="btn btn-outline"
                  style={{ width: "100%" }}
                  onClick={() => navigate(`/equipment/${item.id}`)}
                >
                  View Details
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
