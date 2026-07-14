import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import AuthLayout from "./AuthLayout";
import "./Auth.css";

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await api.post("/auth/login", formData);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Sign in" subtitle="Pick up where your last ticket left off.">
            <form onSubmit={handleSubmit} className="auth-form">
                {error && <p className="auth-error">{error}</p>}

                <label className="auth-label">
                    Email
                    <input
                        type="email"
                        name="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="auth-input"
                    />
                </label>

                <label className="auth-label">
                    Password
                    <div className="auth-password-wrap">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                        <button
                            type="button"
                            className="auth-eye"
                            onClick={() => setShowPassword((s) => !s)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? "🙈" : "👁"}
                        </button>
                    </div>
                </label>

                <button type="submit" disabled={loading} className="auth-submit">
                    {loading ? "Signing in…" : "Sign in"}
                </button>

                <p className="auth-switch">
                    New here? <Link to="/register">Create an account</Link>
                </p>
            </form>
        </AuthLayout>
    );
}

export default Login;