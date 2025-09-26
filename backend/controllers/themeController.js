const fs = require("fs");
const unzipper = require("unzipper");
const path = require("path");
const db = require("../db");

const removeDirectory = async (dirPath) => {
  try {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
    await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dirPath, entry.name);
        return entry.isDirectory()
          ? await removeDirectory(fullPath)
          : await fs.promises.unlink(fullPath);
      })
    );
    await fs.promises.rmdir(dirPath);
  } catch (err) {
    console.error(`Error removing directory ${dirPath}:`, err);
    throw err;
  }
};

const validateThemeStructure = async (themePath) => {
  console.log(`Validating theme structure at: ${themePath}`);

  if (!fs.existsSync(themePath)) {
    throw new Error(`Theme directory not found: ${themePath}`);
  }

  const files = await fs.promises.readdir(themePath);
  console.log(`Files in theme directory:`, files);

  let indexHtmlPath = "";
  let hasIndexHtml = false;

  const commonLocations = [
    "",
    "Main_File/Template",
    "html",
    "template",
    "theme",
    "dist",
    "public",
    "assets",
    "demo",
    "preview",
  ];

  for (const location of commonLocations) {
    const dirPath = location ? path.join(themePath, location) : themePath;

    if (fs.existsSync(dirPath)) {
      try {
        const dirFiles = await fs.promises.readdir(dirPath);

        if (dirFiles.includes("index.html")) {
          hasIndexHtml = true;
          indexHtmlPath = location
            ? path.join(location, "index.html").replace(/\\/g, "/")
            : "index.html";
          console.log(`Found index.html at: ${indexHtmlPath}`);
          break;
        }
      } catch (err) {
        console.log(`Error reading directory ${dirPath}:`, err.message);
      }
    }
  }

  if (!hasIndexHtml) {
    console.log(
      "Index.html not found in common locations, searching recursively..."
    );
    const htmlFiles = [];

    const findHtmlFiles = async (dir, relativePath = "") => {
      try {
        const items = await fs.promises.readdir(dir);

        for (const item of items) {
          const fullPath = path.join(dir, item);
          const itemRelativePath = relativePath
            ? path.join(relativePath, item)
            : item;

          try {
            const stat = await fs.promises.stat(fullPath);

            if (stat.isDirectory()) {
              await findHtmlFiles(fullPath, itemRelativePath);
            } else if (item.toLowerCase().endsWith(".html")) {
              htmlFiles.push(itemRelativePath.replace(/\\/g, "/"));
            }
          } catch (err) {
            console.log(`Error accessing ${fullPath}:`, err.message);
          }
        }
      } catch (err) {
        console.log(`Error reading directory ${dir}:`, err.message);
      }
    };

    await findHtmlFiles(themePath);
    console.log("Found HTML files:", htmlFiles);

    if (htmlFiles.length > 0) {
      const indexFile = htmlFiles.find((file) =>
        file.toLowerCase().endsWith("index.html")
      );
      indexHtmlPath = indexFile || htmlFiles[0];
      hasIndexHtml = true;
      console.log(`Using HTML file: ${indexHtmlPath}`);
    }
  }

  const assets = {
    css: [],
    js: [],
    images: [],
  };

  const scanForAssets = async (dir, relativePath = "") => {
    try {
      const items = await fs.promises.readdir(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const itemRelativePath = relativePath
          ? path.join(relativePath, item)
          : item;

        try {
          const stat = await fs.promises.stat(fullPath);

          if (stat.isDirectory()) {
            await scanForAssets(fullPath, itemRelativePath);
          } else {
            const ext = path.extname(item).toLowerCase();
            const normalizedPath = itemRelativePath.replace(/\\/g, "/");

            if (ext === ".css") {
              assets.css.push(normalizedPath);
            } else if (ext === ".js") {
              assets.js.push(normalizedPath);
            } else if (
              [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"].includes(ext)
            ) {
              assets.images.push(normalizedPath);
            }
          }
        } catch (err) {
          console.log(`Error processing file ${fullPath}:`, err.message);
        }
      }
    } catch (err) {
      console.log(`Error scanning directory ${dir}:`, err.message);
    }
  };

  await scanForAssets(themePath);
  console.log("Found assets:", {
    css: assets.css.length,
    js: assets.js.length,
    images: assets.images.length,
  });

  if (!hasIndexHtml) {
    throw new Error(
      "Invalid theme structure: missing index.html or any HTML file"
    );
  }

  if (assets.css.length === 0 && assets.js.length === 0) {
    console.warn("Warning: No CSS or JS files found in theme");
  }

  return {
    indexHtmlPath,
    assets,
  };
};

const extract = async (
  source,
  targetPath,
  themeName,
  originalZipName = null
) => {
  if (!source || !targetPath) {
    throw new Error("Both source and target path are required for extraction");
  }
  if (!fs.existsSync(source)) {
    throw new Error(`Source file does not exist: ${source}`);
  }

  await fs.promises.mkdir(targetPath, { recursive: true });

  const now = new Date();
  const formattedDate =
    now.toISOString().slice(0, 10) +
    "-" +
    now.getHours().toString().padStart(2, "0") +
    "-" +
    now.getMinutes().toString().padStart(2, "0") +
    "-" +
    now.getSeconds().toString().padStart(2, "0") +
    "-utc";

  let baseFolderName;
  if (originalZipName) {
    baseFolderName = originalZipName;
  } else {
    baseFolderName = themeName.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  }

  const themeDir = path.join(targetPath, `${baseFolderName}-${formattedDate}`);

  await fs.promises.mkdir(themeDir, { recursive: true });

  return new Promise((resolve, reject) => {
    const zip = fs
      .createReadStream(source)
      .pipe(unzipper.Extract({ path: themeDir }))
      .on("close", async () => {
        try {
          const files = await fs.promises.readdir(themeDir);
          if (!files || files.length === 0) {
            await removeDirectory(themeDir);
            return reject(new Error("No files were extracted from the zip"));
          }

          let sourceDir = themeDir;
          if (
            files.length === 1 &&
            (
              await fs.promises.stat(path.join(themeDir, files[0]))
            ).isDirectory()
          ) {
            const subDir = path.join(themeDir, files[0]);
            const subFiles = await fs.promises.readdir(subDir);
            if (subFiles.includes("index.html")) {
              sourceDir = subDir;
            }
          }

          resolve({
            themePath: themeDir,
            sourceDir: sourceDir,
            safeFolderName: path.basename(themeDir),
          });
        } catch (err) {
          await removeDirectory(themeDir).catch(console.error);
          reject(err);
        }
      })
      .on("error", async (err) => {
        await removeDirectory(themeDir).catch(console.error);
        reject(err);
      });
  });
};

exports.uploadTheme = async (req, res) => {
  let uploadedZipPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Theme file is required",
      });
    }

    if (!req.body.name) {
      if (req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        error: "Theme name is required",
      });
    }

    const themeName = req.body.name;
    const themeFile = req.file;

    const themesDir = path.join(__dirname, "../themes");
    if (!fs.existsSync(themesDir)) {
      await fs.promises.mkdir(themesDir, { recursive: true });
    }

    uploadedZipPath = themeFile.path;

    try {
      const originalZipName =
        req.originalThemeName || path.basename(uploadedZipPath, ".zip");
      console.log(`Using original zip name for folder: ${originalZipName}`);

      const { themePath, sourceDir, safeFolderName } = await extract(
        uploadedZipPath,
        themesDir,
        themeName,
        originalZipName
      );

      const { indexHtmlPath, assets } = await validateThemeStructure(sourceDir);

      const [result] = await db.query(
        "INSERT INTO themes (name, folder_name, is_active, assets_json) VALUES (?, ?, ?, ?)",
        [
          themeName,
          safeFolderName,
          0,
          JSON.stringify({
            ...assets,
            indexHtmlPath,
          }),
        ]
      );

      if (uploadedZipPath && fs.existsSync(uploadedZipPath)) {
        await fs.promises.unlink(uploadedZipPath);
      }

      res.json({
        success: true,
        theme: {
          id: result.insertId,
          name: themeName,
          folder_name: safeFolderName,
          is_active: false,
          assets: {
            ...assets,
            indexHtmlPath,
          },
          preview_url: `http://147.93.45.171:1600/themes/preview/${safeFolderName}/${indexHtmlPath}`,
          theme_path: `http://147.93.45.171:1600/themes/static/${safeFolderName}`,
          created_at: new Date().toISOString(),
        },
      });
    } catch (err) {
      throw err;
    }
  } catch (err) {
    if (uploadedZipPath && fs.existsSync(uploadedZipPath)) {
      await fs.promises.unlink(uploadedZipPath).catch(console.error);
    }

    console.error("Upload theme error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to upload theme",
    });
  }
};

exports.activateTheme = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`UPDATE themes SET is_active = 0`);
    await db.query(`UPDATE themes SET is_active = 1 WHERE id = ?`, [id]);
    await db.query("UPDATE themes SET is_active = 0");
    await db.query("UPDATE themes SET is_active = 1 WHERE id = ?", [id]);
    const [[theme]] = await db.query(`SELECT * FROM themes WHERE id = ?`, [id]);
    if (!theme) {
      throw new Error("Theme not found after activation");
    }

    let assets = {};
    try {
      assets =
        theme.assets_json && typeof theme.assets_json === "string"
          ? JSON.parse(theme.assets_json)
          : theme.assets_json || {};
    } catch (e) {
      console.error("Error parsing assets_json:", e);
      assets = {};
    }

    const response = {
      success: true,
      theme: {
        id: theme.id,
        name: theme.name,
        folder_name: theme.folder_name,
        is_active: 1,
        preview_url: theme.preview_url,
        assets: assets,
        theme_path: `/themes/${theme.folder_name}`,
        base_url: "/",
      },
    };

    console.log("Active theme:", response);
    res.json(response);
  } catch (err) {
    console.error("Activate Theme Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.initThemesTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS themes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        folder_name VARCHAR(100) NOT NULL,
        is_active TINYINT(1) DEFAULT 0,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        assets_json JSON
      );
    `);
  } catch (err) {
    console.error("Error initializing themes table:", err);
  }
};

exports.deactivateTheme = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("UPDATE themes SET is_active = 0 WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Deactivate Theme Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.listThemes = async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id,
        name,
        folder_name as folderName,
        is_active as isActive,
        uploaded_at as createdAt,
        assets_json as assets
      FROM themes
      ORDER BY is_active DESC, name ASC
    `);

    const themes = (Array.isArray(rows) ? rows : []).map((theme) => ({
      ...theme,
      assets:
        typeof theme.assets === "string"
          ? JSON.parse(theme.assets)
          : theme.assets || {},
    }));

    const activeTheme = themes.find((theme) => theme.isActive);

    res.json({
      success: true,
      themes: themes,
      activeTheme: activeTheme || null,
    });
  } catch (err) {
    console.error("List Themes Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getActiveTheme = async (_req, res) => {
  try {
    const [[active]] = await db.query(`
      SELECT 
        id,
        name,
        folder_name,
        is_active,
        assets_json
      FROM themes 
      WHERE is_active = 1 
      LIMIT 1
    `);

    if (!active) {
      return res.json({
        success: true,
        theme: null,
      });
    }

    const assets =
      typeof active.assets_json === "string"
        ? JSON.parse(active.assets_json)
        : active.assets_json || {};

    const themeData = {
      id: active.id,
      name: active.name,
      folder_name: active.folder_name,
      is_active: active.is_active === 1,
      preview_url: `http://147.93.45.171:1600/themes/preview/${active.folder_name}/index.html`,
      assets: {
        js: assets.js || [],
        css: assets.css || [],
        folder: active.folder_name,
      },
      theme_path: `http://147.93.45.171:1600/themes/static/${active.folder_name}`,
      base_url: "/",
    };

    res.json({
      success: true,
      theme: themeData,
    });
  } catch (err) {
    console.error("Get Active Theme Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getThemeAssets = async (_req, res) => {
  try {
    const [[theme]] = await db.query(
      `SELECT folder_name, assets_json FROM themes WHERE is_active = 1 LIMIT 1`
    );

    if (!theme) return res.status(404).json({ error: "No active theme" });

    const assets = JSON.parse(theme.assets_json || "{}");

    res.json({ folder: theme.folder_name, ...assets });
  } catch (err) {
    console.error("Get Theme Assets Error:", err);
    res.status(500).json({ error: err.message });
  }
};
