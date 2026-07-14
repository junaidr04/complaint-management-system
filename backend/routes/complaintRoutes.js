const express = require("express");
const router = express.Router();
const {
    createComplaint,
    getMyComplaints,
    getComplaintById,
} = require("../controllers/complaintController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../config/multerConfig");

// protect middleware দিয়ে নিশ্চিত হবে user login করা আছে
router.post("/", protect, upload.array("attachments", 5), createComplaint);
router.get("/my", protect, getMyComplaints);
router.get("/:id", protect, getComplaintById);

module.exports = router;