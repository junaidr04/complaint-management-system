const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
    getAllComplaints,
    assignComplaint,
    updateComplaintStatus,
    getAllUsers,
    updateUserRole,
    createDepartment,
    getDepartments,
} = require("../controllers/adminController");

router.use(protect, authorize("admin"));

router.get("/complaints", getAllComplaints);
router.put("/complaints/:id/assign", assignComplaint);
router.put("/complaints/:id/status", updateComplaintStatus);

router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);

router.get("/departments", getDepartments);
router.post("/departments", createDepartment);

module.exports = router;