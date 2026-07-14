const Complaint = require("../models/Complaint");
const User = require("../models/User");
const Department = require("../models/Department");

// @desc    Get all complaints (Admin only)
// @route   GET /api/admin/complaints
const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate("createdBy", "name email")
            .populate("assignedTo", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Assign a complaint to an agent
// @route   PUT /api/admin/complaints/:id/assign
const assignComplaint = async (req, res) => {
    try {
        const { agentId } = req.body;

        if (!agentId) {
            return res.status(400).json({ message: "agentId is required" });
        }

        const agent = await User.findById(agentId);
        if (!agent || agent.role !== "agent") {
            return res.status(400).json({ message: "Selected user is not a valid agent" });
        }

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { assignedTo: agentId, status: "Assigned" },
            { new: true }
        ).populate("assignedTo", "name email");

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json(complaint);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Update complaint status (Admin can override anytime)
// @route   PUT /api/admin/complaints/:id/status
const updateComplaintStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = [
            "Pending",
            "Under Review",
            "Assigned",
            "In Progress",
            "Waiting for Customer",
            "Resolved",
            "Closed",
            "Rejected",
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json(complaint);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Update a user's role (promote to agent/admin)
// @route   PUT /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!["user", "agent", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Create a department
// @route   POST /api/admin/departments
const createDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Department name is required" });
        }

        const department = await Department.create({ name, description });
        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all departments
// @route   GET /api/admin/departments
const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find().sort({ name: 1 });
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getAllComplaints,
    assignComplaint,
    updateComplaintStatus,
    getAllUsers,
    updateUserRole,
    createDepartment,
    getDepartments,
};