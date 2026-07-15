import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

function CreateComplaint() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
    });
    const [file, setFile] = useState(null);
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
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("category", formData.category);
            if (file) data.append("attachments", file);

            await api.post("/complaints", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="db-page">
            <h1 className="db-title">New complaint</h1>
            <p className="db-subtitle">Give us the details, we'll route it to the right team.</p>

            <form onSubmit={handleSubmit} className="cc-form">
                {error && <p className="db-error">{error}</p>}

                <label className="cc-label">
                    Title
                    <input
                        type="text"
                        name="title"
                        placeholder="e.g. Internet not working"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="cc-input"
                    />
                </label>

                <label className="cc-label">
                    Category
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="cc-input"
                    >
                        <option value="">Select a category</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Water">Water</option>
                        <option value="Internet">Internet</option>
                        <option value="Road">Road</option>
                        <option value="Other">Other</option>
                    </select>
                </label>

                <label className="cc-label">
                    Description
                    <textarea
                        name="description"
                        placeholder="Describe the issue in detail…"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="cc-input"
                    />
                </label>

                <label className="cc-label">
                    Attachment (optional)
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.pdf"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="cc-file"
                    />
                </label>

                <button type="submit" disabled={loading} className="db-cta">
                    {loading ? "Submitting…" : "Submit complaint"}
                </button>
            </form>
        </div>
    );
}

export default CreateComplaint;