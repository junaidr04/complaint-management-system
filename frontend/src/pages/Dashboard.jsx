import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function statusClass(status) {
  if (status === "Resolved" || status === "Closed") return "pill-done";
  if (status === "Pending") return "pill-pend";
  return "pill-prog";
}

function Dashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/complaints/my")
      .then((res) => setComplaints(res.data))
      .catch(() => setComplaints([]))
      .finally(() => setLoading(false));
  }, []);

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const resolved = complaints.filter((c) => ["Resolved", "Closed"].includes(c.status)).length;

  return (
    <div className="db-page">
      <div className="db-header">
        <div>
          <h1 className="db-title">Welcome, {user && user.name ? user.name.split(" ")[0] : ""}</h1>
          <p className="db-subtitle">Here is what is happening with your complaints.</p>
        </div>
        <Link to="/dashboard/new" className="db-cta">+ New Complaint</Link>
      </div>

      <div className="db-stats">
        <div className="db-stat-card">
          <span className="db-stat-num">{total}</span>
          <span className="db-stat-label">Total complaints</span>
        </div>
        <div className="db-stat-card">
          <span className="db-stat-num" style={{ color: "#f5a524" }}>{pending}</span>
          <span className="db-stat-label">Pending</span>
        </div>
        <div className="db-stat-card">
          <span className="db-stat-num" style={{ color: "#22c55e" }}>{resolved}</span>
          <span className="db-stat-label">Resolved</span>
        </div>
      </div>

      <h2 className="db-section-title">Your complaints</h2>

      {loading ? (
        <p className="db-empty">Loading...</p>
      ) : complaints.length === 0 ? (
        <div className="db-empty-box">
          <p>You have not filed any complaints yet.</p>
          <Link to="/dashboard/new" className="db-cta db-cta-outline">File your first complaint</Link>
        </div>
      ) : (
        <div className="db-list">
          {complaints.map((c) => (
            <div className="db-complaint-card" key={c._id}>
              <div className="db-complaint-main">
                <span className="db-complaint-title">{c.title}</span>
                <span className="db-complaint-cat">{c.category}</span>
              </div>
              <span className={"db-pill " + statusClass(c.status)}>{c.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
