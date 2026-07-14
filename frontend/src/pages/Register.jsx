import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import AuthLayout from "./AuthLayout";
import "./Auth.css";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
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

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    try {
      await api.post("/auth/register", {
        name: fullName,
        email: formData.email,
        password: formData.password,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Open your first ticket in under a minute.">
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="auth-error">{error}</p>}

        <div className="auth-row">
          <label className="auth-label">
            First name
            <input
              type="text"
              name="firstName"
              placeholder="Junaid"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </label>

          <label className="auth-label">
            Last name
            <input
              type="text"
              name="lastName"
              placeholder="Bin"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </label>
        </div>

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
              placeholder="At least 6 characters"
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
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Register;