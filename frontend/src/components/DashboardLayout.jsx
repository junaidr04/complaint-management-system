import { useState, useEffect, useMemo } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./DashboardLayout.css";

const STAR_COUNT = 30;

function useStars() {
  return useMemo(() => {
    return Array.from({ length: STAR_COUNT }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 6,
      drift: i % 6 === 0,
    }));
  }, []);
}

function DashboardLayout() {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(() => localStorage.getItem("redress-theme") === "dark");
  const stars = useStars();

  useEffect(() => {
    localStorage.setItem("redress-theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <div className={"dash-shell " + (isDark ? "theme-dark" : "")}>
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <span className="dash-brand-mark">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 5v6c0 5 3.4 8.7 8 9 4.6-.3 8-4 8-9V5l-8-3z" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8.5 12.2l2.4 2.4L16 9.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          Redress
        </div>

        <nav className="dash-nav">
          <NavLink to="/dashboard" end className="dash-nav-link">Overview</NavLink>
          <NavLink to="/dashboard/new" className="dash-nav-link">New Complaint</NavLink>
        </nav>

        <div className="dash-user">
          <div className="dash-user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="dash-user-info">
            <span className="dash-user-name">{user?.name}</span>
            <span className="dash-user-role">{user?.role}</span>
          </div>
          <button className="dash-theme-toggle" onClick={() => setIsDark((d) => !d)} aria-label="Toggle dark mode">
            {isDark ? "SUN" : "MOON"}
          </button>
          <button className="dash-logout" onClick={logout} aria-label="Logout">Logout</button>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-star-field" aria-hidden="true">
          {stars.map((s) => (
            <span
              key={s.id}
              className={"dash-star " + (s.drift ? "dash-star-drift" : "")}
              style={{ top: s.top + "%", left: s.left + "%", width: s.size + "px", height: s.size + "px", animationDelay: s.delay + "s" }}
            />
          ))}
        </div>
        <div className="dash-blob dash-blob-a" aria-hidden="true" />
        <div className="dash-blob dash-blob-b" aria-hidden="true" />

        <div className="dash-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
