const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|pdf/;
    const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeValid = allowedTypes.test(file.mimetype);

    if (extValid && mimeValid) {
        cb(null, true);
    } else {
        cb(new Error("Only images (jpg, jpeg, png, webp) and PDF files are allowed"));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;


//Complaint-এ Image/PDF upload 