import { useState, useMemo, useEffect } from "react";

const STAR_COUNT = 45;

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

const tickets = [
    { id: "#4471", title: "Water pressure low — Sector 4", status: "PEND" },
    { id: "#4470", title: "Internet outage — Block C", status: "PROG" },
    { id: "#4468", title: "Streetlight not working — Lane 9", status: "DONE" },
    { id: "#4465", title: "Billing discrepancy — Invoice 221", status: "PROG" },
    { id: "#4462", title: "AC malfunction — 3rd Floor", status: "PEND" },
    { id: "#4459", title: "Pothole on Main Road", status: "DONE" },
];

const statusLabel = { PEND: "Pending", PROG: "In Progress", DONE: "Resolved" };

function AuthLayout({ title, subtitle, children }) {
    const [isDark, setIsDark] = useState(
        () => localStorage.getItem("redress-theme") === "dark"
    );

    useEffect(() => {
        localStorage.setItem("redress-theme", isDark ? "dark" : "light");
    }, [isDark]); const loopTickets = [...tickets, ...tickets];
    const stars = useStars();

    return (
        <div className={`auth-shell ${isDark ? "theme-dark" : ""}`}>
            <aside className="auth-aside">
                <div className="auth-brand">
                    <span className="auth-brand-mark">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 2L4 5v6c0 5 3.4 8.7 8 9 4.6-.3 8-4 8-9V5l-8-3z"
                                stroke="currentColor"
                                strokeWidth="1.6"
                            />
                            <path
                                d="M8.5 12.2l2.4 2.4L16 9.6"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                    Redress
                </div>

                <p className="auth-tagline">
                    Track it.
                    <br />
                    Solve it.
                    <br />
                    Close it.
                </p>

                <div className="ticket-feed" aria-hidden="true">
                    <div className="ticket-track">
                        {loopTickets.map((t, i) => (
                            <div className="ticket-card" key={i}>
                                <span className="ticket-id">{t.id}</span>
                                <span className="ticket-title">{t.title}</span>
                                <span className={`ticket-pill pill-${t.status.toLowerCase()}`}>
                                    {statusLabel[t.status]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="auth-stats">
                    <div>
                        <span className="stat-num">92%</span>
                        <span className="stat-label">closed on SLA</span>
                    </div>
                    <div>
                        <span className="stat-num">3.1h</span>
                        <span className="stat-label">avg. first response</span>
                    </div>
                    <div>
                        <span className="stat-num">12.4k</span>
                        <span className="stat-label">tickets resolved</span>
                    </div>
                </div>
            </aside>

            <main className="auth-main">
                <div className="star-field" aria-hidden="true">
                    {stars.map((s) => (
                        <span
                            key={s.id}
                            className={`star ${s.drift ? "star-drift" : ""}`}
                            style={{
                                top: `${s.top}%`,
                                left: `${s.left}%`,
                                width: `${s.size}px`,
                                height: `${s.size}px`,
                                animationDelay: `${s.delay}s`,
                            }}
                        />
                    ))}
                </div>

                <div className="auth-blob blob-a" aria-hidden="true" />
                <div className="auth-blob blob-b" aria-hidden="true" />

                <button
                    type="button"
                    className="theme-toggle"
                    onClick={() => setIsDark((d) => !d)}
                    aria-label="Toggle dark mode"
                >
                    {isDark ? "☀️" : "🌙"}
                </button>

                <div className="auth-main-inner">
                    <div className="auth-mobile-brand">Redress</div>
                    <h1 className="auth-title">{title}</h1>
                    <p className="auth-subtitle">{subtitle}</p>
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AuthLayout;