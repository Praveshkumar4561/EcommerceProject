const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "-");
    req.originalThemeName = originalName.replace(/\.zip$/, "");
    cb(null, originalName);
  },
});

module.exports = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/zip" && !file.originalname.endsWith(".zip")) {
      return cb(new Error("Only zip files are allowed"));
    }
    cb(null, true);
  },
  limits: { fileSize: 50 * 1024 * 1024 },
});
