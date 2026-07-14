const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes"); // complaintRoutes যোগ করা হয়েছে

// .env file theke variables load kora
dotenv.config();

// Database connect kora
connectDB();

const app = express();

// Middleware
app.use(express.json()); // JSON data porar jonno
app.use(cookieParser()); // Cookie porar jonno
app.use(
    cors({
        origin: "http://localhost:5173", // Vite frontend er default port
        credentials: true, // Cookie pathanor permission
    })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes); // authRoutes এর ঠিক পরে যোগ করা হয়েছে

// Test Route
app.get("/", (req, res) => {
    res.send("🚀 Complaint Management System API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🟢 Server running on port ${PORT}`);
});