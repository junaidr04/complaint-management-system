const Complaint = require("../models/Complaint");

// @desc    Create new complaint
// @route   POST /api/complaints
const createComplaint = async (req, res) => {
    try {
        const { title, description, category } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        let attachments = [];
        if (req.files && req.files.length > 0) {
            attachments = req.files.map((file) => ({
                fileName: file.originalname,
                filePath: file.path,
                fileType: file.mimetype.includes("pdf") ? "pdf" : "image",
            }));
        }

        const complaint = await Complaint.create({
            title,
            description,
            category,
            attachments,
            createdBy: req.user._id,
        });

        res.status(201).json(complaint);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all complaints of the logged-in user
// @route   GET /api/complaints/my
const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ createdBy: req.user._id }).sort({
            createdAt: -1,
        });
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get single complaint by ID (Track Complaint)
// @route   GET /api/complaints/:id
const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate("createdBy", "name email")
            .populate("assignedTo", "name email");

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        if (
            complaint.createdBy._id.toString() !== req.user._id.toString() &&
            req.user.role === "user"
        ) {
            return res.status(403).json({ message: "Not authorized to view this complaint" });
        }

        res.status(200).json(complaint);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createComplaint, getMyComplaints, getComplaintById };