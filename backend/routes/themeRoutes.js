const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const themeController = require("../controllers/themeController");

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
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

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype !== "application/zip" &&
      !file.originalname.endsWith(".zip")
    ) {
      return cb(new Error("Only zip files are allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

router.get("/", themeController.listThemes);
router.post("/upload", upload.single("theme"), themeController.uploadTheme);
router.put("/activate/:id", themeController.activateTheme);
router.put("/deactivate/:id", themeController.deactivateTheme);
router.get("/active", themeController.getActiveTheme);

router.use((err, req, res, next) => {
  console.error("Theme route error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
  });
});

router.use("/static", (req, res, next) => {
  if (req.path.endsWith('.html')) {
    const filePath = path.join(__dirname, "../themes", req.path);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(
        /window\.parent\.location\.href\s*=\s*`http:\/\/localhost:5173\/\$\{page\}`/g,
        'window.parent.postMessage({ type: "navigate", path: `/${page}` }, "*")'
      );
      content = content.replace(
        /window\.parent\.location\.href\s*=\s*"http:\/\/localhost:5173\/"/g,
        'window.parent.postMessage({ type: "navigate", path: "/" }, "*")'
      );
      content = content.replace(
        /a\.setAttribute\("href", `http:\/\/localhost:5173\/\$\{page\}`\)/g,
        'a.setAttribute("href", "#")'
      );
      content = content.replace(
        /a\.setAttribute\("href", "http:\/\/localhost:5173\/"\)/g,
        'a.setAttribute("href", "#")'
      );
      res.setHeader('Content-Type', 'text/html');
      res.send(content);
      return;
    }
  }
  next();
});

router.use(
  "/static",
  express.static(path.join(__dirname, "../themes"), {
    index: false,
    redirect: false,
    fallthrough: true,
  })
);

router.get("/preview/:theme/*", (req, res) => {
  const themePath = path.join(__dirname, "../themes", req.params.theme);
  const requestPath = req.params[0] || "index.html";

  const templatePath = path.join(
    themePath,
    "Main_File",
    "Template",
    requestPath
  );
  if (fs.existsSync(templatePath)) {
    return res.sendFile(templatePath);
  }

  const rootPath = path.join(themePath, requestPath);
  if (fs.existsSync(rootPath)) {
    return res.sendFile(rootPath);
  }

  res.status(404).json({ error: "Theme file not found" });
});

module.exports = router;
