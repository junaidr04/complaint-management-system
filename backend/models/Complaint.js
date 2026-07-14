const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
        },
        status: {
            type: String,
            enum: [
                "Pending",
                "Under Review",
                "Assigned",
                "In Progress",
                "Waiting for Customer",
                "Resolved",
                "Closed",
                "Rejected",
            ],
            default: "Pending",
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High", "Urgent"],
            default: "Medium",
        },
        attachments: [
            {
                fileName: String,
                filePath: String,
                fileType: String,
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        internalNotes: [
            {
                note: String,
                addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        replies: [
            {
                message: String,
                sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);


/*
এখানে কী আছে বুঝিয়ে বলি:

title, description, category — Complaint-এর basic তথ্য
status — ৮টা ধাপের যেকোনো একটা (তোমার list থেকে নেওয়া)
priority — AI পরে এইটা predict করবে, আপাতত default Medium
attachments — Image/PDF ফাইলের তথ্য array আকারে থাকবে
createdBy — কোন User এই Complaint বানিয়েছে (User model-এর সাথে link করা)
assignedTo — কোন Agent-কে assign করা হয়েছে
internalNotes — Agent-রা নিজেদের মধ্যে যে note রাখবে (customer দেখবে না)
replies — Customer-কে যেই reply পাঠানো হবে
*/