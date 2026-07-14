const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["user", "agent", "admin"],
            default: "user",
        },
    },
    { timestamps: true } // createdAt, updatedAt automatically add hobe
);

// Password save korar age automatically hash kore dibe (Async-friendly, next-less pattern)
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Login er somoy password match korar function
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

/*
এখানে কী হচ্ছে বুঝিয়ে বলি:

userSchema.pre("save", async function (next) { ... }) থেকে (next) প্যারামিটারটি বাদ দেওয়া হয়েছে।

ভেতরে থাকা return next(); পরিবর্তন করে শুধু return; করা হয়েছে。

শেষের next(); লাইনটি পুরোপুরি মুছে ফেলা হয়েছে。

এখন async ফাংশনটির কাজ শেষ হওয়া মাত্রই Mongoose নিজে থেকেই বুঝে নেবে যে সিকোয়েন্সটি সফলভাবে সম্পন্ন হয়েছে এবং ডকুমেন্টটি ডেটাবেজে সেভ করে দেবে।
*/
