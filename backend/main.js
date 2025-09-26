require("dotenv").config();
const express = require("express");
const path = require("path");
const compression = require("compression");
const { SitemapStream, streamToPromise } = require("sitemap");
const db = require("./db");
const geoip = require("geoip-lite");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const ExcelJS = require("exceljs");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const webpush = require("web-push");
const themeRoutes = require("./routes/themeRoutes");
const { initThemesTable } = require("./controllers/themeController");
const salt = 10;
const saltRounds = 10;
const app = express();

app.use(
  cors({
    origin: ["http://srv689968.hstgr.cloud","http://147.93.45.171:1600"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/api/themes", themeRoutes);
app.set("view engine", "ejs");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.set(
  "views",
  path.join(
    __dirname,
    "themes/roiser-multipurpose-ecommerce-html5-template-2024-08-20-06-31-54-utc-2025-06-12-15-16-08-utc/roiser-html-package/roiser"
  )
);

app.use(
  "/themes",
  express.static(path.join(__dirname, "themes"), {
    extensions: ["html"],
  })
);

app.get("/", async (req, res) => {
  try {
    const [[active]] = await db.query(
      "SELECT folder_name FROM themes WHERE is_active = 1 LIMIT 1"
    );
    if (active) {
      res.redirect(`/api/themes/${active.folder_name}/index.html`);
    } else {
      res.sendFile(path.join(__dirname, "../frontend1/index.html"));
    }
  } catch (err) {
    console.error("Error redirecting to active theme:", err);
    res.sendFile(path.join(__dirname, "../frontend1/index.html"));
  }
});

app.use("/themes", themeRoutes);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "themes"));
app.set("views", path.join(__dirname, "themes/roiser-html-package/roiser"));

app.use(
  "/themes/static",
  (req, res, next) => {
    try {
      let requestedPath = (req.path || req.url || "").split("?")[0];
      requestedPath = decodeURIComponent(requestedPath).replace(/^\/+/, "");

      const basePath = path.join(__dirname, "themes");
      const fullPath = path.normalize(path.join(basePath, requestedPath));

      if (!fullPath.startsWith(path.normalize(basePath + path.sep))) {
        return res.status(403).send("Access denied");
      }

      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
        const indexHtml = path.join(fullPath, "index.html");
        if (fs.existsSync(indexHtml)) return res.sendFile(indexHtml);
      }

      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        return res.sendFile(fullPath);
      }

      const maybeHtml = fullPath.endsWith(".html")
        ? fullPath
        : `${fullPath}.html`;
      if (fs.existsSync(maybeHtml) && fs.statSync(maybeHtml).isFile()) {
        return res.sendFile(maybeHtml);
      }

      return next();
    } catch (err) {
      console.error("Error serving static file (themes/static):", err);
      return next(err);
    }
  },
  express.static(path.join(__dirname, "themes"), { index: false })
);

app.use(
  "/api/themes/static",
  (req, res, next) => {
    req.url = req.url.replace(/^\/+/, "");
    next();
  },
  express.static(path.join(__dirname, "themes"), { index: false })
);

initThemesTable();
const themesDir = path.join(__dirname, "themes");
if (!fs.existsSync(themesDir)) {
  fs.mkdirSync(themesDir, { recursive: true });
}

app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/src/image", express.static(path.join(__dirname, "src/image")));
app.set("trust proxy", true);

// app.set("views", path.join(__dirname, "themes"));

app.post("/update-robots", (req, res) => {
  const { content } = req.body;
  const robotsPath = path.join(__dirname, "../frontend1/public/robots.txt");
  fs.writeFile(robotsPath, content, (err) => {
    if (err) {
      console.error("Error writing robots.txt", err);
      return res.status(500).json({ message: "Error saving robots.txt" });
    }
    res.json({ message: "robots.txt updated successfully" });
  });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// custom upload zip code

// const upload = multer({ dest: 'uploads/' });

const uploadDir = path.join(__dirname, "src/image");
const publicFolder = path.join(__dirname, "../frontend1/public");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(publicFolder)) {
  fs.mkdirSync(publicFolder, { recursive: true });
}

const adsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, publicFolder);
  },
  filename: function (req, file, cb) {
    cb(null, "ads.txt");
  },
});
const adsUpload = multer({ storage: adsStorage });

app.use("/uploads", express.static(uploadDir));

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const fileUrl = `/images/${req.file.filename}`;
  res.json({ url: fileUrl });
});
app.use("/images", express.static(uploadDir));

app.get("/get-homepage", (req, res) => {
  res.status(200).json({ homepageSettings });
});

app.use(
  "/get-theme-logo/src/image",
  express.static(path.join(__dirname, "src/image"))
);

app.use(
  "/productpagedata/src/image",
  express.static(path.join(__dirname, "src/image"))
);

app.use(
  "/customersdata/src/image",
  express.static(path.join(__dirname, "src/image"))
);

app.use(
  "/blogpostdata/src/image",
  express.static(path.join(__dirname, "src/image"))
);

app.use(express.static(path.join(__dirname, "../frontend1/public")));

const publicVapidKey =
  "BPJVSJMYeYgCD13-Sv8ziP9m6ecOBSc8KfIJ055G9wsCmE80aYWKPEUKkamseWpIkorpD3-Vs3NLBmBLvXEASGI";
const privateVapidKey = "h2r9X6cwNN1GxczN_e9N2Ggh0Ap3jcrmfBhWmW9xNX8";

webpush.setVapidDetails(
  "mailto:your-email@example.com",
  publicVapidKey,
  privateVapidKey
);

app.get("/sw.js", (req, res) => {
  res.set("Content-Type", "application/javascript");
  res.sendFile(path.join(__dirname, "..", "frontend1", "public", "sw.js"));
});

app.get("/themes/:themeName/:page", (req, res) => {
  const { themeName, page } = req.params;

  const htmlFilePath = path.join(
    __dirname,
    "themes",
    themeName,
    `${page}.html`
  );

  res.sendFile(htmlFilePath, (err) => {
    if (err) {
      res.status(404).send("Page not found");
    }
  });
});

const getCurrentLastMod = () => new Date().toISOString();

function authenticateUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  jwt.verify(token, "jwt-secret-key", (err, decoded) => {
    if (err) return res.redirect("/login");
    req.user = decoded;
    next();
  });
}

app.get("/", authenticateUser, (req, res) => {
  res.render("/", { user: req.user });
});

const links = [
  { url: "/", lastmodISO: getCurrentLastMod(), priority: 1.0 },
  { url: "/about", lastmodISO: getCurrentLastMod(), priority: 0.9 },
  { url: "/shop", lastmodISO: getCurrentLastMod(), priority: 0.9 },
  { url: "/blog", lastmodISO: getCurrentLastMod(), priority: 0.9 },
  { url: "/product-details", lastmodISO: getCurrentLastMod(), priority: 0.9 },
  {
    url: "/product-categories",
    lastmodISO: getCurrentLastMod(),
    priority: 0.9,
  },
  { url: "/cart", lastmodISO: getCurrentLastMod(), priority: 0.9 },
  { url: "/wishlist", lastmodISO: getCurrentLastMod(), priority: 0.9 },
  { url: "/contact-us", lastmodISO: getCurrentLastMod(), priority: 0.9 },
  { url: "/faqs", lastmodISO: getCurrentLastMod(), priority: 0.9 },
  { url: "/privacy-policy", lastmodISO: getCurrentLastMod(), priority: 0.8 },
  { url: "/medicine-policy", lastmodISO: getCurrentLastMod(), priority: 0.8 },
  { url: "/terms-condition", lastmodISO: getCurrentLastMod(), priority: 0.8 },
  { url: "/sitemap", lastmodISO: getCurrentLastMod(), priority: 1.0 },
];

app.get("/sitemap.xml", async (req, res, next) => {
  try {
    res.header("Content-Type", "application/xml");
    const smStream = new SitemapStream({
      hostname: "http://srv689968.hstgr.cloud",
    });
    links.forEach((link) => smStream.write(link));
    smStream.end();
    const sitemapOutput = await streamToPromise(smStream);
    res.send(sitemapOutput.toString());
  } catch (err) {
    next(err);
  }
});

let homepageSettings = {
  homepage: "",
  aboutpage: "",
  shop: "",
  blog: "",
  contactus: "",
  faqs: "",
};

app.post("/save-homepage", (req, res) => {
  const { homepage, aboutpage, shop, blog, contactus } = req.body;
  homepageSettings = {
    homepage: homepage || homepageSettings.homepage,
    aboutpage: aboutpage || homepageSettings.aboutpage,
    shop: shop || homepageSettings.shop,
    blog: blog || homepageSettings.blog,
    contactus: contactus || homepageSettings.contactus,
  };
  res.status(200).json({
    message: "Homepage settings saved successfully",
    homepageSettings,
  });
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Error: "token is not correct" });
      } else {
        req.name = decoded.name;
        next();
      }
    });
  }
};

app.get("/", verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name });
});

app.post("/submit", (req, res) => {
  let { first_name, last_name, phone_number, email, password } = req.body;

  last_name = last_name || null;
  phone_number = phone_number || null;

  if (!first_name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, Error: "Missing required fields" });
  }

  bcrypt.hash(password.toString(), saltRounds, (err, hash) => {
    if (err) {
      console.error("Password hashing error:", err);
      return res
        .status(500)
        .json({ success: false, Error: "Password hashing error" });
    }

    const sql =
      "INSERT INTO user(first_name, last_name, phone_number, email, password) VALUES (?, ?, ?, ?, ?)";
    const values = [first_name, last_name, phone_number, email, hash];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ success: false, Error: "Error while inserting data" });
      }

      const newUserId = result.insertId;

      const token = jwt.sign({ email }, "jwt-secret-key", { expiresIn: "1d" });

      res.clearCookie("token");
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 86400000,
        path: "/",
      });

      return res.status(200).json({
        success: true,
        message: "Registration successful",
        user_id: newUserId,
      });
    });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ Error: "Both email and password are required" });
  }
  const sql = "SELECT * FROM user WHERE email=?";
  db.query(sql, [email], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ Error: "Login error" });
    }
    if (data.length > 0) {
      const storedHashedPassword = data[0].password;
      bcrypt.compare(password, storedHashedPassword, (err, response) => {
        if (err) {
          console.error("Error comparing password:", err);
          return res.status(500).json({ Error: "Password comparison error" });
        }

        if (response) {
          let user = {
            id: data[0].id,
            first_name: data[0].first_name,
            last_name: data[0].last_name,
            email: data[0].email,
          };

          let token = jwt.sign({ name: user.first_name }, "JWT_SECRET", {
            expiresIn: "3h",
          });
          const tokenExpirationTime = Date.now() + 3 * 60 * 60 * 1000;
          res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "None",
            maxAge: 3 * 60 * 60 * 1000,
          });

          return res.status(200).json({
            success: true,
            message: "Login successful",
            user_id: user.id,
            user: user,
            tokenExpiration: tokenExpirationTime,
          });
        } else {
          console.log("Password not matched.");
          return res.status(400).json({ Error: "Password not matched" });
        }
      });
    } else {
      console.log("No user found with the email.");
      return res.status(404).json({ Error: "No user with the provided email" });
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });
  return res.json({ Status: "Success", message: "Logged out successfully" });
});

app.get("/alldata", (req, res) => {
  const sql = "SELECT * from user";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/allreviewdata", (req, res) => {
  const sql = "select *from user order by id asc limit 4";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.put("/passwordupdate", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ Error: "Unauthorized. No token provided." });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ Error: "Both current and new passwords are required." });
    }
    const sql = "SELECT * FROM user WHERE id = ?";
    db.query(sql, [userId], async (err, result) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ Error: "Database error." });
      }
      if (result.length === 0) {
        return res.status(404).json({ Error: "User not found." });
      }
      const user = result[0];
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ Error: "Current password is incorrect." });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updateSql = "UPDATE user SET password = ? WHERE id = ?";
      db.query(updateSql, [hashedPassword, userId], (err, result) => {
        if (err) {
          console.error("Error updating password:", err);
          return res.status(500).json({ Error: "Database error." });
        }
        res.json({
          Status: "Success",
          Message: "Password updated successfully!",
        });
      });
    });
  } catch (error) {
    console.error("Token Verification Error:", error);
    return res.status(401).json({ Error: "Invalid or expired token." });
  }
});

app.get("/check-auth", (req, res) => {
  const sql = "SELECT * from user";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/checkout", (req, res) => {
  const {
    email,
    phone_number,
    first_name,
    last_name,
    address,
    apartment,
    country,
    pincode,
    date,
    cart,
    subtotal,
    tax,
    shippingFee,
    total,
    payment,
    payment_status,
    status,
    company,
    town,
    state,
    notes,
  } = req.body;

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const getLatestInvoiceSql = `SELECT invoice_number FROM checkout ORDER BY id DESC LIMIT 1`;
  db.query(getLatestInvoiceSql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error retrieving invoice number" });
    }

    let newInvoiceNumber = "INV-1031";
    if (result.length > 0) {
      const lastInvoiceNumber = result[0].invoice_number;
      const lastNumber = parseInt(lastInvoiceNumber.split("-")[1], 10);
      newInvoiceNumber = `INV-${lastNumber + 1}`;
    }

    const mysqlDate = new Date(date || Date.now())
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const checkoutSql = `
      INSERT INTO checkout (
        email, phone_number, first_name, last_name, address, apartment, 
        country, pincode, date, subtotal, tax, shippingFee, total, 
        invoice_number, payment, payment_status, company, town, state, notes
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const checkoutValues = [
      email || null,
      phone_number || null,
      first_name || null,
      last_name || null,
      address || null,
      apartment || null,
      country || null,
      pincode || null,
      mysqlDate,
      subtotal || null,
      tax || "0",
      shippingFee || "0",
      total || null,
      newInvoiceNumber,
      payment || null,
      payment_status || "unpaid",
      company || null,
      town || null,
      state || null,
      notes || null,
    ];

    db.query(checkoutSql, checkoutValues, (err, result) => {
      if (err) {
        console.error("❌ Error inserting checkout data:", err);
        return res.status(500).json({ error: "Error submitting order" });
      }

      const checkoutId = result.insertId;
      const orderNumber = `#${checkoutId + 1000}`;

      const updateOrderNumberSql = `UPDATE checkout SET order_number = ? WHERE id = ?`;
      db.query(updateOrderNumberSql, [orderNumber, checkoutId], (err) => {
        if (err) {
          return res.status(500).json({ error: "Error updating order number" });
        }

        const cartSql = `
          INSERT INTO cart_items (checkout_id, image, name, quantity, price, subtotal, tax, store) 
          VALUES ?
        `;

        const cartValues = cart.map((item) => [
          checkoutId,
          item.image || null,
          item.name || null,
          item.quantity || "1",
          item.price || "0",
          item.subtotal || "0",
          item.tax || "0",
          item.store || "",
        ]);

        db.query(cartSql, [cartValues], (err) => {
          if (err) {
            console.error("❌ Error inserting cart data:", err);
            return res
              .status(500)
              .json({ error: "Error submitting cart data" });
          }

          res.json({
            message: "Order created successfully",
            orderNumber: orderNumber,
            invoiceNumber: newInvoiceNumber,
          });
        });
      });
    });
  });
});

app.get("/checkoutsome/:id", (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT checkout.*, cart_items.*
    FROM checkout
    LEFT JOIN cart_items ON checkout.id = cart_items.checkout_id
    WHERE checkout.id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error fetching checkout data:", err);
      return res.status(500).send("Error fetching data");
    } else {
      res.json(result);
    }
  });
});

app.get("/checkoutdata", (req, res) => {
  const sql = `
    SELECT
      checkout.*,
      cart_items.checkout_id,
      cart_items.image,
      cart_items.name AS item_name,
      cart_items.quantity,
      cart_items.price,
      cart_items.store,
      cart_items.subtotal AS item_subtotal,
      cart_items.tax AS item_tax
    FROM checkout
    LEFT JOIN cart_items ON checkout.id = cart_items.checkout_id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching checkout data:", err);
      return res.status(500).send("Error fetching checkout data");
    }
    const formattedResult = result.reduce((acc, row) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          ...row,
          cartItems: [],
        };
      }
      if (row.checkout_id) {
        acc[row.id].cartItems.push({
          image: row.image,
          name: row.item_name,
          quantity: row.quantity,
          price: row.price,
          subtotal: row.item_subtotal,
          tax: row.item_tax,
        });
      }
      return acc;
    }, {});
    const response = Object.values(formattedResult);
    res.json(response);
  });
});

app.get("/checkoutdata1", (req, res) => {
  const query = `
    SELECT DATE(date) AS date, COUNT(*) AS orders
    FROM checkout
    GROUP BY DATE(date)
    ORDER BY DATE(date) ASC
  `;
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching orders data:", error);
      return res.status(500).json({ error: "Database query error" });
    }
    res.json(results);
  });
});

app.get("/customerget/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM checkout WHERE first_name LIKE ? ";
  db.query(sql, [`%${data}%`, `%${data}%`], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database query failed" });
    } else {
      res.json(result);
    }
  });
});

app.delete("/deleteorder1/:id", (req, res) => {
  const id = req.params.id;

  const sqlDeleteCartItems = "DELETE FROM cart_items WHERE checkout_id = ?";
  const sqlDeleteCheckout = "DELETE FROM checkout WHERE id = ?";

  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting DB connection:", err);
      return res.status(500).json({ error: "Database connection failed" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        console.error("Transaction failed to start:", err);
        connection.release();
        return res.status(500).json({ error: "Transaction failed to start" });
      }

      connection.query(sqlDeleteCartItems, [id], (err) => {
        if (err) {
          console.error("Error deleting cart items:", err);
          return connection.rollback(() => {
            connection.release();
            res.status(500).json({ error: "Failed to delete cart items" });
          });
        }

        connection.query(sqlDeleteCheckout, [id], (err) => {
          if (err) {
            console.error("Error deleting checkout record:", err);
            return connection.rollback(() => {
              connection.release();
              res
                .status(500)
                .json({ error: "Failed to delete checkout record" });
            });
          }

          connection.commit((err) => {
            if (err) {
              console.error("Transaction commit failed:", err);
              return connection.rollback(() => {
                connection.release();
                res.status(500).json({ error: "Transaction commit failed" });
              });
            }

            connection.release();
            res.send("Order and associated cart items deleted successfully.");
          });
        });
      });
    });
  });
});

app.get("/searchorder/:value", (req, res) => {
  const data = req.params.value;
  const sql =
    "SELECT * FROM checkout WHERE first_name LIKE ? OR last_name LIKE ?";
  const searchTerm = `%${data}%`;
  db.query(sql, [searchTerm, searchTerm], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

app.post("/faqs", (req, res) => {
  const {
    name = null,
    email = null,
    subject = null,
    message = null,
  } = req.body;

  const sql = `
    INSERT INTO faqs
      (name, email, subject, message)
    VALUES
      (?,    ?,     ?,       ?)
  `;

  db.query(sql, [name, email, subject, message], (err, result) => {
    if (err) {
      console.error("DB insert error:", err);
      return res
        .status(500)
        .json({ error: "An error occurred saving your FAQ entry." });
    }
  });
});

app.post("/contact", (req, res) => {
  const {
    name,
    email,
    subject,
    content,
    address = null,
    phone = null,
    link = null,
  } = req.body;

  const sql = `
    INSERT INTO contact
      (name, email, address, phone, subject, content, link)
    VALUES
      (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, address, phone, subject, content, link],
    (err, result) => {
      if (err) {
        console.error("DB insert error:", err);
        return res.status(500).send("Error saving contact");
      }
      res.send("Data submitted");
    }
  );
});

app.get("/contactreqdata", (req, res) => {
  const sql = "SELECT * from contact";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/contactsomedata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * from contact where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/contactdelete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from contact where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.post("/announce", (req, res) => {
  const { name, content, start_date, end_date, active } = req.body;
  const value = [[name, content, start_date, end_date, active]];
  const sql =
    "insert into announce(name,content,start_date,end_date,active)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/getannounce", (req, res) => {
  const sql = "SELECT * from announce";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});
app.delete("/deleteannoune/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from announce where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.put("/updateannnounce/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const fields = Object.keys(data);
  const values = Object.values(data);

  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const sql = `UPDATE announce SET ${setClause} WHERE id = ?`;

  values.push(id);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).send("Failed to update data.");
    }
    res.send("Data updated successfully.");
  });
});

app.get("/getann/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * from announce where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/search/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * from announce where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/testimonials", upload.single("file"), (req, res) => {
  const name = req.body.name;
  const company = req.body.company;
  const status = req.body.status;
  const date = req.body.date;
  const content = req.body.content;
  const image = req.file?.filename || null;

  const sql =
    "INSERT INTO testimonial (name, company, status, date, content, image) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [name, company, status, date, content, image];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).send("Failed to submit testimonial.");
    }
    res.send("Data submitted successfully.");
  });
});

app.get("/gettestimonials", (req, res) => {
  const sql = "SELECT * from testimonial";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/testifilter/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * from testimonial where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/deletetest/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from testimonial where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.put("/updatetest/:id", upload.single("file"), (req, res) => {
  const { name, company, status, date, content } = req.body;
  const id = req.params.id;
  const image = req.file ? req.file.filename : null;
  let sql =
    "update testimonial set name = ?, company = ?, status = ?, date = ?,content=?";
  let values = [name, company, status, date, content];
  if (image) {
    sql += ", image = ?";
    values.push(image);
  }
  sql += " WHERE id = ?";
  values.push(id);
  db.query(sql, values, (err, result) => {
    if (err) {
      throw err;
    }
    res.send("Data updated successfully.");
  });
});

app.get("/sometest/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * from testimonial where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/gallerypost", upload.single("file"), (req, res) => {
  const name = req.body.name;
  const permalink = req.body.permalink;
  const orders = req.body.orders;
  const date = req.body.date;
  const feature = req.body.feature;
  const description = req.body.description;
  const status = req.body.status;
  const image = req.file.filename;
  let value = [
    [name, permalink, orders, date, feature, description, status, image],
  ];
  const sql =
    "insert into gallery(name,permalink,orders,date,feature,description,status,image)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/gallerydata", (req, res) => {
  const sql = "SELECT * from gallery";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/galleryfil/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * from gallery where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/deletegallery/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from gallery where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data successfully deleted");
    }
  });
});

app.put("/galleryupdates/:id", upload.single("file"), (req, res) => {
  const { name, permalink, orders, date, feature, description, status } =
    req.body;
  const id = req.params.id;
  const image = req.file ? req.file.filename : null;
  let sql =
    "update gallery set name=?, permalink=?, orders=?, date=?, feature=?,description=?, status=?";
  let values = [name, permalink, orders, date, feature, description, status];
  if (image) {
    sql += ", image = ?";
    values.push(image);
  }
  sql += " WHERE id = ?";
  values.push(id);
  db.query(sql, values, (err, result) => {
    if (err) {
      throw err;
    }
    res.send("Data updated successfully.");
  });
});

app.get("/gallerytests/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM gallery where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/sliderspost", (req, res) => {
  const { name, sliderkey, description, date, status } = req.body;
  const value = [[name, sliderkey, description, date, status]];
  const sql =
    "insert into sliders(name,sliderkey,description,date,status)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/sliderdata", (req, res) => {
  const sql = "SELECT * FROM sliders";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/slidersdelete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from sliders where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.get("/searchslider/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM sliders where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.put("/sliderupdate/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const sql = "update sliders set ? where id=?";
  db.query(sql, [data, id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data updated");
    }
  });
});

app.get("/someslider/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM sliders where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/newsletterpost", (req, res) => {
  const { email, name } = req.body;
  const safeName = name ? name : null;
  const sql = "INSERT INTO newsletters (email, name) VALUES (?, ?)";
  db.query(sql, [email, safeName], (err, result) => {
    if (err) {
      console.error("Error submitting data:", err);
      return res.status(500).send("Database error");
    }
    res.send("Data submitted successfully");
  });
});

app.get("/newsletterdata", (req, res) => {
  const sql = "select *from newsletters";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/newsfilter/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * from newsletters where email like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/export-excel", async (req, res) => {
  try {
    db.query("SELECT * FROM newsletters", async (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        res.status(500).send("Error querying the database.");
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");

      if (results.length > 0) {
        worksheet.columns = Object.keys(results[0]).map((key) => ({
          header: key,
          key: key,
        }));

        results.forEach((row) => worksheet.addRow(row));
      } else {
        worksheet.addRow(["No data available"]);
      }

      res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      await workbook.xlsx.write(res);
      res.end();
    });
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).send("Error generating Excel file.");
  }
});

app.delete("/newsletterdelete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from newsletters where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.post("/contactdata", (req, res) => {
  const {
    type,
    name,
    phone,
    email,
    address,
    subject,
    content,
    required,
    orders,
    date,
    status,
  } = req.body;
  const value = [
    [
      type,
      name,
      phone,
      email,
      address,
      subject,
      content,
      required,
      orders,
      date,
      status,
    ],
  ];
  const sql =
    "insert into contactus(type,name,phone,email,address,subject,content,required,orders,date,status)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/allcontact", (req, res) => {
  const sql = "SELECT * FROM contactus";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/export-excelcontact", async (req, res) => {
  try {
    db.query("SELECT * FROM contact", async (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        res.status(500).send("Error querying the database.");
        return;
      }
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");
      if (results.length > 0) {
        worksheet.columns = Object.keys(results[0]).map((key) => ({
          header: key,
          key: key,
        }));
        results.forEach((row) => worksheet.addRow(row));
      } else {
        worksheet.addRow(["No data available"]);
      }
      res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      await workbook.xlsx.write(res);
      res.end();
    });
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).send("Error generating Excel file.");
  }
});

app.put("/updatecontact/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const sql = "update contactus set ? where id=?";
  db.query(sql, [data, id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data updated");
    }
  });
});

app.get("/contactusget/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM contactus where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/contactsearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM contact where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/deletecontact/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from contactus where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.post("/pagespost", upload.single("file"), (req, res) => {
  const {
    name,
    permalink,
    description,
    status,
    template,
    breadcrumb,
    date,
    content,
  } = req.body;
  const image = req.file.filename;
  const value = [
    [
      name,
      permalink,
      description,
      status,
      template,
      breadcrumb,
      date,
      content,
      image,
    ],
  ];
  const sql =
    "insert into pages(name,permalink,description,status,template,breadcrumb,date,content,image)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/pagesdata", (req, res) => {
  const sql = "SELECT * FROM pages";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/pagesdata/:slug", (req, res) => {
  const { slug } = req.params;
  db.query("SELECT * FROM pages WHERE name = ?", [slug], (err, result) => {
    if (err || result.length === 0)
      return res.status(404).json({ error: "Page Not Found" });
    res.json(result[0]);
  });
});

app.delete("/pagesdelete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from pages where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.put("/pageupdate/:id", upload.single("file"), (req, res) => {
  const {
    name,
    permalink,
    description,
    status,
    date,
    template,
    breadcrumb,
    content,
  } = req.body;
  const id = req.params.id;
  const image = req.file ? req.file.filename : null;
  let sql =
    "update pages set name = ?, permalink = ?, description = ?, status = ?, date= ?, template= ?,breadcrumb=?,content=?";
  let values = [
    name,
    permalink,
    description,
    status,
    date,
    template,
    breadcrumb,
    content,
  ];
  if (image) {
    sql += ", image = ?";
    values.push(image);
  }
  sql += " WHERE id = ?";
  values.push(id);
  db.query(sql, values, (err, result) => {
    if (err) {
      throw err;
    }
    res.send("Data updated successfully.");
  });
});

app.get("/pagesomedata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM pages where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/pagesearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM pages where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/faqsubmit", (req, res) => {
  const { category, question, answer, date, status } = req.body;
  const value = [[category, question, answer, date, status]];
  const sql =
    "insert into faqback(category,question,answer,date,status)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.json("data submitted");
    }
  });
});

app.get("/pagesdatafaqs", (req, res) => {
  const sql =
    "SELECT * FROM faqback WHERE status = 'published' OR status = 'default'";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching FAQs:", err);
      res.status(500).send("Server error");
    } else {
      res.json(result);
    }
  });
});

app.delete("/faqsdelete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from faqback where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.put("/faqspageupdate/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const sql = "update faqback set ? where id=?";
  db.query(sql, [data, id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data updated");
    }
  });
});

app.get("/faqsomedata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM faqback where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/faqsearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM faqback where question like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/faqcategory", (req, res) => {
  const { name, description, orders, date, status } = req.body;
  const value = [[name, description, orders, date, status]];
  const sql =
    "insert into faqcategory(name, description,orders, date, status)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.json("data submitted");
    }
  });
});

app.get("/faqcategorydata", (req, res) => {
  const sql = "SELECT * FROM faqcategory";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/faqcategorydelete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from faqcategory where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.put("/faqcategoryupdate/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const sql = "update faqcategory set ? where id=?";
  db.query(sql, [data, id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data updated");
    }
  });
});

app.get("/faqcategorysomedata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM faqcategory where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/faqsearchcategory/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM faqcategory where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/blogtagpost", (req, res) => {
  const { name, permalink, description, date, status } = req.body;
  const value = [[name, permalink, description, date, status]];
  const sql =
    "insert into blogtags(name,permalink, description, date, status)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.json("data submitted");
    }
  });
});

app.get("/blogalldata", (req, res) => {
  const sql = "SELECT * FROM blogtags";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/blogtagsdelete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from blogtags where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.put("/blogtagupdate/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const sql = "update blogtags set ? where id=?";
  db.query(sql, [data, id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data updated");
    }
  });
});

app.get("/blogtagdata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM blogtags where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/blogtagsearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM blogtags where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/blogpostsubmit", upload.single("file"), (req, res) => {
  const name = req.body.name;
  const author_name = req.body.author_name;
  const permalink = req.body.permalink;
  const description = req.body.description;
  const content = req.body.content;
  const feature = req.body.feature;
  const status = req.body.status;
  const categories = req.body.categories;
  const date = req.body.date;
  const tags = req.body.tags;
  const image = req.file.filename;
  const value = [
    [
      name,
      author_name,
      permalink,
      description,
      content,
      feature,
      status,
      categories,
      date,
      tags,
      image,
    ],
  ];

  const sql = `INSERT INTO blogpost
    (name, author_name, permalink, description, content, feature, status, categories, date,tags, image)
    VALUES ?`;
  db.query(sql, [value], (err, result) => {
    if (err) {
      console.error("Error inserting blog post:", err);
      return res.status(500).send("Error submitting data");
    }

    const message = {
      title: "New Blog Post Published!",
      body: `${name} by ${author_name} is now live. Click to read more.`,
    };
    sendPushNotification(message)
      .then(() => {
        res.send("Blog post submitted and notifications sent");
      })
      .catch((notificationErr) => {
        console.error("Push notification error:", notificationErr);
        res.send("Blog post submitted but failed to send notifications");
      });
  });
});

app.get("/blogpostdata", (req, res) => {
  const sql = "SELECT * FROM blogpost ORDER BY id DESC;";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/blogpostdata/:id", (req, res) => {
  const blogId = req.params.id;
  const sql = "SELECT * FROM blogpost WHERE id = ?";
  db.query(sql, [blogId], (err, result) => {
    if (err) {
      console.error("Error fetching blog by ID:", err);
      return res.status(500).send("Server Error");
    }
    if (result.length === 0) {
      return res.status(404).send("Blog not found");
    }
    res.json(result[0]);
  });
});

app.get("/latestblogdata", (req, res) => {
  const sql = "select *from blogpost";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/commentpost/:id", (req, res) => {
  const blogId = req.params.id;
  const names = req.body.names ?? null;
  const email = req.body.email ?? null;
  const message = req.body.message ?? null;
  const phone_number = req.body.phone_number ?? null;
  const link = req.body.link ?? null;
  const star = req.body.star ?? null;
  const sql = `
    INSERT INTO blog_comments
      (blog_id, names, email, message, phone_number, link, star)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [blogId, names, email, message, phone_number, link, star],
    (err, result) => {
      if (err) {
        console.error("Error inserting comment:", err);
        return res.status(500).send("Database error");
      }
      res.send("Comment successfully posted");
    }
  );
});

app.get("/commentsdatagets/:id", (req, res) => {
  const blogId = req.params.id;
  const sql = "SELECT * FROM blog_comments WHERE blog_id = ?";
  db.query(sql, [blogId], (err, results) => {
    if (err) {
      console.error("Error fetching comments:", err);
      return res.status(500).send("Database error");
    }
    res.json(results);
  });
});

app.put("/blogpostupdate/:id", upload.single("file"), (req, res) => {
  const {
    name,
    author_name,
    permalink,
    description,
    content,
    feature,
    status,
    categories,
    date,
    tags,
  } = req.body;
  const id = req.params.id;
  const image = req.file ? req.file.filename : null;
  let sql =
    "update blogpost set name = ?, author_name=?, permalink = ?,description=?,content=?,feature= ?, status= ?,categories=?, date = ?, tags=?";
  let values = [
    name,
    author_name,
    permalink,
    description,
    content,
    feature,
    status,
    categories,
    date,
    tags,
  ];
  if (image) {
    sql += ", image = ?";
    values.push(image);
  }
  sql += " WHERE id = ?";
  values.push(id);
  db.query(sql, values, (err, result) => {
    if (err) {
      throw err;
    }
    res.send("Data updated successfully.");
  });
});

app.get("/blogsomedata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM blogpost where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/deleteblogpost/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from blogpost where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json("data deleted");
    }
  });
});

app.get("/blogpostsearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM blogpost where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/blogcategorypost", (req, res) => {
  const { name, permalink, parent, description, is_featured, status } =
    req.body;
  const value = [[name, permalink, parent, description, is_featured, status]];
  const sql =
    "insert into blog_category(name,permalink,parent,description,is_featured,status)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/allcategorydata", (req, res) => {
  const sql = "select *from blog_category";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/categorydelete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from blog_category where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.put("/categoryupdate/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const sql = "UPDATE blog_category SET ? WHERE id = ?";
  db.query(sql, [data, id], (err, result) => {
    if (err) {
      res.status(500).send("Error updating category");
    } else {
      res.send("data updated");
    }
  });
});

app.post(
  "/adspost",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "desktopImage", maxCount: 1 },
    { name: "mobileImage", maxCount: 1 },
  ]),
  (req, res) => {
    const {
      name,
      title,
      subtitle,
      button,
      keyads,
      orders,
      adstype,
      status,
      location,
      expired,
      ads_size,
    } = req.body;
    const image = req.files["file"] ? req.files["file"][0].filename : null;
    const desktopImage = req.files["desktopImage"]
      ? req.files["desktopImage"][0].filename
      : null;
    const mobileImage = req.files["mobileImage"]
      ? req.files["mobileImage"][0].filename
      : null;
    if (!image && !desktopImage && !mobileImage) {
      return res
        .status(400)
        .send("At least one image (main, desktop, or mobile) is required.");
    }
    const value = [
      [
        name,
        title,
        subtitle,
        button,
        keyads,
        orders,
        adstype,
        status,
        location,
        expired,
        ads_size,
        image,
        desktopImage,
        mobileImage,
      ],
    ];

    const sql =
      "INSERT INTO ads (name, title, subtitle, button, keyads, orders, adstype, status,location, expired,ads_size, image, desktopImage, mobileImage) VALUES ?";

    db.query(sql, [value], (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).send("Database insertion failed.");
      }
      res.send("Data submitted successfully.");
    });
  }
);

app.get("/adsdata", (req, res) => {
  const sql = "SELECT * FROM ads";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.put(
  "/adsupdate/:id",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "desktopImage", maxCount: 1 },
    { name: "mobileImage", maxCount: 1 },
  ]),
  (req, res) => {
    const {
      name,
      title,
      subtitle,
      button,
      keyads,
      orders,
      adstype,
      status,
      location,
      expired,
      ads_size,
      removeImage,
      removeTabletImage,
      removeMobileImage,
    } = req.body;
    const id = req.params.id;

    let sql =
      "UPDATE ads SET name=?, title=?, subtitle=?, button=?, keyads=?, orders=?, adstype=?, status=?, location=?, expired=?, ads_size=?";
    let values = [
      name,
      title,
      subtitle,
      button,
      keyads,
      orders,
      adstype,
      status,
      location,
      expired,
      ads_size,
    ];

    if (removeImage === "true") {
      sql += ", image = NULL";
    } else if (req.files["file"] && req.files["file"].length > 0) {
      sql += ", image = ?";
      values.push(req.files["file"][0].filename);
    }

    if (removeTabletImage === "true") {
      sql += ", desktopImage = NULL";
    } else if (
      req.files["desktopImage"] &&
      req.files["desktopImage"].length > 0
    ) {
      sql += ", desktopImage = ?";
      values.push(req.files["desktopImage"][0].filename);
    }

    if (removeMobileImage === "true") {
      sql += ", mobileImage = NULL";
    } else if (
      req.files["mobileImage"] &&
      req.files["mobileImage"].length > 0
    ) {
      sql += ", mobileImage = ?";
      values.push(req.files["mobileImage"][0].filename);
    }

    sql += " WHERE id = ?";
    values.push(id);

    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.send("Data updated successfully.");
    });
  }
);

app.get("/adsomedataads/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM ads where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/deleteads/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from ads where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json("data deleted");
    }
  });
});

app.get("/adsearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM ads where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/producttags", (req, res) => {
  const { name, permalink, description, date, status } = req.body;
  const value = [[name, permalink, description, date, status]];
  const sql =
    "insert into producttags(name,permalink,description,date,status)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/producttagdata", (req, res) => {
  const sql = "SELECT * FROM producttags";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/deletetags/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from producttags where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.put("/updateproducttags/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const sql = "update producttags set ? where id=?";
  db.query(sql, [data, id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data updated");
    }
  });
});

app.get("/productsometag/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM producttags where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/searchtags/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM producttags where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/export-returnsorder", async (req, res) => {
  try {
    db.query("SELECT * FROM returnorder", async (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        res.status(500).send("Error querying the database.");
        return;
      }
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");

      if (results.length > 0) {
        worksheet.columns = Object.keys(results[0]).map((key) => ({
          header: key,
          key: key,
        }));
        results.forEach((row) => worksheet.addRow(row));
      } else {
        worksheet.addRow(["No data available"]);
      }
      res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      await workbook.xlsx.write(res);
      res.end();
    });
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).send("Error generating Excel file.");
  }
});

app.post("/productcollection", upload.single("file"), (req, res) => {
  const { name, slug, description, status, feature, date } = req.body;
  const image = req.file.filename;
  const value = [[name, slug, description, status, feature, date, image]];
  const sql =
    "insert into productcollection(name,slug,description,status,feature,date,image)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/collectionsdata", (req, res) => {
  const sql = "SELECT * FROM productcollection";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/collectiondelete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from productcollection where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.get("/searchcollections/:value", (req, res) => {
  const data = req.params.value;
  if (!data) {
    return res.status(400).json({ error: "Search value is required" });
  }
  const sql = "SELECT * FROM productcollection WHERE name LIKE ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(result);
  });
});

app.put("/collectionupdate/:id", upload.single("file"), (req, res) => {
  const { name, slug, description, status, feature, date } = req.body;
  const id = req.params.id;
  const image = req.file ? req.file.filename : null;
  let sql =
    "update productcollection set name=?,slug=?, description=?,status=?,feature=?, date=?";
  let values = [name, slug, description, status, feature, date];
  if (image) {
    sql += ", image = ?";
    values.push(image);
  }
  sql += " WHERE id = ?";
  values.push(id);
  db.query(sql, values, (err, result) => {
    if (err) {
      throw err;
    }
    res.send("Data updated successfully.");
  });
});

app.get("/collectionsome/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM productcollection where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/productlabels", (req, res) => {
  const { name, color, status, date } = req.body;
  const value = [[name, color, status, date]];
  const sql = "insert into productlabels(name, color, status, date)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/productlabelsdata", (req, res) => {
  const sql = "SELECT * FROM productlabels";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/deletelabels/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from productlabels where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.put("/labelsupdate/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const sql = "update productlabels set ? where id=?";
  db.query(sql, [data, id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data updated");
    }
  });
});

app.get("/searchlabels/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM productlabels where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/productlabelsdata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM productlabels where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/brandsubmit", upload.single("file"), (req, res) => {
  const {
    name,
    permalink,
    description,
    website,
    sort,
    status,
    featured,
    date,
  } = req.body;
  const image = req.file.filename;
  const value = [
    [
      name,
      permalink,
      description,
      website,
      sort,
      status,
      featured,
      date,
      image,
    ],
  ];
  const sql =
    "insert into brands(name, permalink, description, website,sort,status,featured,date,image)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/brandsdata", (req, res) => {
  const sql = "SELECT * FROM brands";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/deletebrands/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from brands where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.get("/searchbrand/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM brands where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.put("/brandupdate/:id", upload.single("file"), (req, res) => {
  const {
    name,
    permalink,
    description,
    website,
    sort,
    status,
    featured,
    date,
  } = req.body;
  const id = req.params.id;
  const image = req.file ? req.file.filename : null;
  let sql =
    "update brands set name=?,permalink=?,description=?,website=?,sort=?,status=?,featured=?, date=?";
  let values = [
    name,
    permalink,
    description,
    website,
    sort,
    status,
    featured,
    date,
  ];
  if (image) {
    sql += ", image = ?";
    values.push(image);
  }
  sql += " WHERE id = ?";
  values.push(id);
  db.query(sql, values, (err, result) => {
    if (err) {
      throw err;
    }
    res.send("Data updated successfully.");
  });
});

app.get("/brandssomedata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM brands where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/productoptions", (req, res) => {
  let { name, date, status, featured, options } = req.body;

  if (!options || options === "null" || options.length === 0) {
    options = null;
  }

  const sql =
    "INSERT INTO productoptions (name, date, status, featured, options) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, date, status, featured, options], (err, result) => {
    if (err) {
      console.error("DB insert error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({
      message: "Data submitted successfully",
      id: result.insertId,
    });
  });
});

app.get("/productoptiondata", (req, res) => {
  const sql = "SELECT * FROM productoptions";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/deleteproductoptions/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from productoptions where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.get("/searchproductoption/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM productoptions where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.put("/updateproductoptions/:id", (req, res) => {
  const { name, date, status, featured, options } = req.body;
  const sql =
    "UPDATE productoptions SET name = ?, date = ?, status = ?, featured = ?, options = ? WHERE id = ?";
  db.query(
    sql,
    [name, date, status, featured, options, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({
        message: "Updated successfully",
        affected: result.affectedRows,
      });
    }
  );
});

app.get("/optionsomedata/:id", (req, res) => {
  const sql =
    "SELECT id, name, date, status, featured, options FROM productoptions WHERE id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(404).json({ error: "Not found" });
    res.json(results[0]);
  });
});

app.post(
  "/productattributes",
  upload.array("attributeImages"),
  (req, res, next) => {
    const { title, slug, sort, status, date, attributes } = req.body;

    if (!title || !slug || !attributes) {
      return res
        .status(400)
        .json({ message: "Title, slug and attributes are required" });
    }

    let parsedAttributes;
    try {
      parsedAttributes = JSON.parse(attributes);
    } catch (err) {
      return res.status(400).json({ message: "Invalid attributes format" });
    }

    const files = req.files || [];

    const mapped = parsedAttributes.map((attr, index) => {
      const image = files[index] ? files[index].filename : attr.imageUrl || "";
      return {
        title: attr.title,
        isDefault: !!attr.isDefault,
        color: attr.color,
        image,
      };
    });

    const sql = `
    INSERT INTO productattribute (title, slug, sort, status, date, options)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
    const params = [
      title,
      slug,
      sort || null,
      status,
      date,
      JSON.stringify(mapped),
    ];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Insert Error:", err);
        return res.status(500).json({ message: "Database insert failed" });
      }
      res.json({
        id: result.insertId,
        message: "Attribute set created successfully",
      });
    });
  }
);

app.get("/attributesdata", (req, res) => {
  const sql = "SELECT * FROM productattribute order by id desc";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/attributesdata1", (req, res) => {
  const sql = "SELECT * FROM productattribute order by id desc limit 5";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/attrubutedelete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from productattribute where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.get("/attributesearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM productattribute where title like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.put(
  "/updateattributes/:id",
  upload.array("attributeImages"),
  (req, res, next) => {
    const id = req.params.id;

    const {
      title,
      slug,
      sort,
      status,
      date,
      attributes: rawAttributes,
    } = req.body;

    const sets = [];
    const params = [];

    if (title !== undefined) {
      sets.push("title = ?");
      params.push(title);
    }
    if (slug !== undefined) {
      sets.push("slug = ?");
      params.push(slug);
    }
    if (sort !== undefined) {
      sets.push("sort = ?");
      params.push(sort);
    }
    if (status !== undefined) {
      sets.push("status = ?");
      params.push(status);
    }
    if (date !== undefined) {
      sets.push("date = ?");
      params.push(date);
    }

    if (rawAttributes !== undefined) {
      let optsArray;
      try {
        optsArray = JSON.parse(rawAttributes);
      } catch {
        return res.status(400).json({ message: "Invalid attributes JSON" });
      }
      sets.push("options = ?");
      params.push(JSON.stringify(optsArray));
    }

    if (sets.length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    params.push(id);

    const sql = `UPDATE productattribute
                 SET ${sets.join(", ")}
                 WHERE id = ?`;

    db.query(sql, params, (err, result) => {
      if (err) return next(err);
      res.json({ message: "Attribute set updated" });
    });
  }
);

app.get("/attributesomedata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM productattribute where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/flashsales", (req, res) => {
  const { name, start_date, end_date, status, products } = req.body;

  const saleSql = `
    INSERT INTO flashsales (name, start_date, status, end_date)
    VALUES (?, ?, ?, ?)
  `;
  db.query(saleSql, [name, start_date, status, end_date], (err, result) => {
    if (err) {
      console.error("Error inserting flashsale:", err);
      return res.status(500).json({ error: err.message });
    }
    const flashsaleId = result.insertId;
    if (Array.isArray(products) && products.length) {
      const placeholders = products
        .map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .join(", ");
      const values = [];
      products.forEach((p) => {
        values.push(
          flashsaleId,
          p.id,
          p.name,
          p.price,
          p.quantity,
          p.image,
          p.brand,
          p.price_sale,
          p.label
        );
      });

      const prodSql = `
        INSERT INTO flashsale_products 
          (flashsale_id, product_id, product_name, price, quantity, image, brand, price_sale,label)
        VALUES ${placeholders}
      `;

      db.query(prodSql, values, (err2) => {
        if (err2) {
          console.error("Error inserting flashsale_products:", err2);
          return res.status(500).json({ error: err2.message });
        }
        return res.json({
          message: "Flash sale and products saved successfully.",
        });
      });
    } else {
      return res.json({ message: "Flash sale created (no products)." });
    }
  });
});

app.get("/flashsalesdata", (req, res) => {
  const salesSql = "SELECT * FROM flashsales";
  db.query(salesSql, (err, results) => {
    if (err) {
      console.error("Error fetching flashsales:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.delete("/flashsaledelete/:id", (req, res) => {
  const flashsaleId = req.params.id;

  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting DB connection:", err);
      return res.status(500).json({ error: err.message });
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        console.error("Transaction error:", err);
        return res.status(500).json({ error: err.message });
      }

      const deleteProductsSql = `
        DELETE FROM flashsale_products
        WHERE flashsale_id = ?
      `;

      connection.query(deleteProductsSql, [flashsaleId], (err) => {
        if (err) {
          return connection.rollback(() => {
            connection.release();
            console.error("Error deleting products:", err);
            res.status(500).json({ error: err.message });
          });
        }

        const deleteSaleSql = `
          DELETE FROM flashsales
          WHERE id = ?
        `;

        connection.query(deleteSaleSql, [flashsaleId], (err2) => {
          if (err2) {
            return connection.rollback(() => {
              connection.release();
              console.error("Error deleting flashsale:", err2);
              res.status(500).json({ error: err2.message });
            });
          }

          connection.commit((err3) => {
            if (err3) {
              return connection.rollback(() => {
                connection.release();
                console.error("Commit error:", err3);
                res.status(500).json({ error: err3.message });
              });
            }

            connection.release();
            res.json({
              message: "Flash sale and associated products deleted.",
            });
          });
        });
      });
    });
  });
});

app.get("/flashsalesmaindata", (req, res) => {
  const sql = `
    SELECT 
      f.*, 
      p.* 
    FROM 
      flashsales f 
    JOIN 
      flashsale_products p 
    ON 
      f.id = p.flashsale_id
  `;

  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get("/searchflash/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM flashsales where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.put("/updateflashsales/:id", (req, res) => {
  const id = req.params.id;
  const { name, start_date, status, end_date, products } = req.body;

  const updateFlashSaleSql =
    "UPDATE flashsales SET name = ?, start_date = ?, status = ?, end_date = ? WHERE id = ?";
  const deleteProductsSql =
    "DELETE FROM flashsale_products WHERE flashsale_id = ?";
  const insertProductSql = `
    INSERT INTO flashsale_products (flashsale_id, product_id, product_name, image, price, quantity,brand,price_sale,label)
    VALUES ?
  `;

  db.query(
    updateFlashSaleSql,
    [name, start_date, status, end_date, id],
    (err, result) => {
      if (err) {
        console.error("Error updating flash sale:", err);
        return res.status(500).send("Error updating flash sale");
      }

      db.query(deleteProductsSql, [id], (err2) => {
        if (err2) {
          console.error("Error deleting old flashsale products:", err2);
          return res.status(500).send("Error clearing old products");
        }

        if (!Array.isArray(products) || products.length === 0) {
          return res.send("Flash sale updated (no products added)");
        }

        const values = products.map((p) => [
          id,
          p.id,
          p.name,
          p.image,
          p.price,
          p.quantity,
          p.brand,
          p.price_sale,
          p.label,
        ]);

        db.query(insertProductSql, [values], (err3) => {
          if (err3) {
            console.error("Error inserting products:", err3);
            return res.status(500).send("Error inserting products");
          }

          res.send("Flash sale and products updated successfully");
        });
      });
    }
  );
});

app.get("/flashsalessome/:id", (req, res) => {
  const id = req.params.id;
  const flashSaleSql = "SELECT * FROM flashsales WHERE id = ?";
  const productsSql =
    "SELECT product_id AS id, product_name AS name, image, price, quantity, brand, price_sale, label FROM flashsale_products WHERE flashsale_id = ?";

  db.query(flashSaleSql, [id], (err, flashSaleResult) => {
    if (err) {
      console.error("Error fetching flash sale:", err);
      return res.status(500).send("Error fetching flash sale");
    }

    if (flashSaleResult.length === 0) {
      return res.status(404).send("Flash sale not found");
    }

    db.query(productsSql, [id], (err2, productsResult) => {
      if (err2) {
        console.error("Error fetching products:", err2);
        return res.status(500).send("Error fetching products");
      }

      const flashSale = flashSaleResult[0];
      flashSale.products = productsResult;
      res.json(flashSale);
    });
  });
});

app.get("/allflashdata", (req, res) => {
  const salesSql = "SELECT * FROM flashsales";
  const productsSql = "SELECT * FROM flashsale_products";
  db.query(salesSql, (err, sales) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query(productsSql, (err2, products) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ sales, products });
    });
  });
});

app.post("/usersubmit", upload.single("file"), (req, res) => {
  const {
    first_name,
    last_name,
    phone_number,
    email,
    password,
    dob,
    notes,
    status,
    gender,
  } = req.body;
  let image = req.file.filename;
  bcrypt.hash(password.toString(), salt, (err, hash) => {
    if (err) return res.status(500).json({ Error: "Error hashing password" });
    const value = [
      [
        first_name,
        last_name,
        phone_number,
        email,
        hash,
        dob,
        notes,
        status,
        gender,
        image,
      ],
    ];
    const sql =
      "INSERT INTO user(first_name, last_name, phone_number, email, password, dob, notes, status, gender, image) VALUES ?";
    db.query(sql, [value], (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Error inserting data into database" });
      }
      res.send("Data submitted successfully!");
    });
  });
});

app.get("/customersdata", (req, res) => {
  const sql = "SELECT * FROM customers";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/export-customerdata", async (req, res) => {
  try {
    db.query("select * from user", async (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        res.status(500).send("Error querying the database.");
        return;
      }
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");

      if (results.length > 0) {
        const filteredResults = results.map(
          ({ password, confirmpassword, ...rest }) => rest
        );

        worksheet.columns = Object.keys(filteredResults[0]).map((key) => ({
          header: key,
          key: key,
        }));

        filteredResults.forEach((row) => worksheet.addRow(row));
      } else {
        worksheet.addRow(["No data available"]);
      }

      res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      await workbook.xlsx.write(res);
      res.end();
    });
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).send("Error generating Excel file.");
  }
});

app.get("/customersearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM user where first_name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/customerdelete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from user where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.put("/userupdate/:id", upload.single("file"), (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    dob,
    password,
    notes,
    status,
    gender,
  } = req.body;
  const id = req.params.id;
  const image = req.file ? req.file.filename : null;
  let hashedPassword = password;
  if (password) {
    bcrypt.hash(password, salt, (err, hashed) => {
      if (err) {
        return res.status(500).send("Error hashing password.");
      }
      hashedPassword = hashed;
      let sql =
        "UPDATE user SET first_name=?, last_name=?, email=?, phone_number=?, dob=?, password=?, notes=?, status=?,gender=?";
      let values = [
        first_name,
        last_name,
        email,
        phone_number,
        dob,
        hashedPassword,
        notes,
        status,
        gender,
      ];
      if (image) {
        sql += ", image = ?";
        values.push(image);
      }
      sql += " WHERE id = ?";
      values.push(id);
      db.query(sql, values, (err, result) => {
        if (err) {
          return res.status(500).send("Error updating data.");
        }
        res.send("Data updated successfully.");
      });
    });
  } else {
    let sql =
      "UPDATE user SET first_name=?, last_name=?, email=?, phone_number=?, dob=?, notes=?, status=?,gender=?";
    let values = [
      first_name,
      last_name,
      email,
      phone_number,
      dob,
      notes,
      status,
      gender,
    ];

    if (image) {
      sql += ", image = ?";
      values.push(image);
    }

    sql += " WHERE id = ?";
    values.push(id);

    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).send("Error updating data.");
      }
      res.send("Data updated successfully.");
    });
  }
});

app.put("/passwordupdate", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Received Token:", token);
    if (!token) {
      console.log("Token is missing from request headers");
      return res
        .status(401)
        .json({ status: "error", message: "Unauthorized. No token provided." });
    }

    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ status: "error", message: "All fields are required." });
    }
    const sql = "SELECT password FROM user WHERE id = ?";
    db.query(sql, [userId], async (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ status: "error", message: "Database error." });
      if (result.length === 0) {
        return res
          .status(404)
          .json({ status: "error", message: "User not found." });
      }
      const storedPassword = result[0].password;
      const match = await bcrypt.compare(currentPassword, storedPassword);
      if (!match) {
        return res
          .status(401)
          .json({ status: "error", message: "Incorrect current password." });
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      const sqlUpdate = "UPDATE user SET password = ? WHERE id = ?";
      db.query(sqlUpdate, [hashedNewPassword, userId], (err, updateResult) => {
        if (err)
          return res
            .status(500)
            .json({ status: "error", message: "Error updating password." });

        return res.json({
          status: "success",
          message: "Password updated successfully.",
        });
      });
    });
  } catch (error) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid or expired token." });
  }
});

app.get("/somecustomerdata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM user where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/customerpopupsubmit", (req, res) => {
  const { name, phone, email, country, state, city, address } = req.body;
  const value = [[name, phone, email, country, state, city, address]];
  const sql =
    "insert into customerpopup(name,phone,email,country,state,city,address)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/customerpopupdata", (req, res) => {
  const sql = "SELECT * FROM customerpopup";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/reviewdatasubmit", (req, res) => {
  const contentType = req.headers["content-type"] || "";
  if (!contentType.includes("multipart/form-data")) {
    return res.status(400).send("Invalid content-type");
  }

  upload.any()(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).send("File upload error");
    } else if (err) {
      return res.status(500).send("Server error");
    }

    const {
      product_name = "",
      user_name = "",
      email = "",
      star = 0,
      comment = "",
      product_image = "",
    } = req.body;

    let imageString = product_image;
    if (req.files && req.files.length > 0) {
      imageString = req.files.map((f) => f.filename).join(",");
    }

    const sql = `
      INSERT INTO reviews
        (product_name, user_name, email, star, comment, image)
      VALUES
        (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      product_name,
      user_name,
      email,
      Number(star),
      comment,
      imageString,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error inserting into database:", err);
        return res.status(500).send("Server error");
      }
      res.status(200).send("Review submitted");
    });
  });
});

app.get("/reviewdata", (req, res) => {
  const sql = "SELECT * FROM reviews order by id desc";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/reviewdelete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from reviews where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.get("/reviewsearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM reviews where product_name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/reviewsomedata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM reviews where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/deleteviewreview/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from reviews where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.post("/discountsubmit", (req, res) => {
  const {
    discounttype,
    couponcode,
    coupontype,
    conditions,
    orders,
    start_date,
    end_date,
    display,
  } = req.body;
  const value = [
    [
      discounttype,
      couponcode,
      coupontype,
      conditions,
      orders,
      start_date,
      end_date,
      display,
    ],
  ];
  const sql =
    "insert into discounts(discounttype,couponcode,coupontype,conditions,orders,start_date,end_date,display)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/discountdata", (req, res) => {
  const sql = "SELECT * FROM discounts";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/discountdelete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from discounts where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.get("/discountsearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM discounts where couponcode like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.put("/discountupdate/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const sql = "update discounts set ? where id=?";
  db.query(sql, [data, id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data updated");
    }
  });
});

app.get("/discountsomedata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM discounts where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/productpage", upload.single("file"), (req, res) => {
  const {
    name,
    permalink,
    description,
    content,
    sku,
    price,
    price_sale,
    cost,
    barcode,
    stockstatus,
    weight,
    length,
    wide,
    height,
    status,
    store,
    featured,
    brand,
    minimumorder,
    maximumorder,
    date,
    label,
    label1,
    tags,
    categories,
    attribute,
    faqs,
  } = req.body;
  const image = req.file ? req.file.filename : null;
  const value = [
    [
      name,
      permalink,
      description,
      content,
      sku,
      price,
      price_sale,
      cost,
      barcode,
      stockstatus,
      weight,
      length,
      wide,
      height,
      status,
      store,
      featured,
      brand,
      minimumorder,
      maximumorder,
      date,
      image,
      label,
      label1,
      tags,
      categories,
      attribute,
      faqs,
    ],
  ];

  const sql = `INSERT INTO products 
    (name, permalink, description,content, sku, price, price_sale, cost, barcode, stockstatus, weight, length, wide, height, status, store, featured, brand, minimumorder, maximumorder, date, image, label, label1, tags, categories,attribute,faqs)
    VALUES ?`;

  db.query(sql, [value], (err, result) => {
    if (err) {
      console.error("Error inserting product:", err);
      return res.status(500).send("Error inserting data");
    }

    const message = {
      title: "New Product Alert!",
      body: `Introducing our new product: ${name}. Check it out now!`,
    };

    sendPushNotification(message)
      .then(() => {
        res.send("Product submitted and notifications sent");
      })
      .catch((notificationErr) => {
        console.error("Push notification error:", notificationErr);
        res.send("Product submitted but failed to send notifications");
      });
  });
});

app.get("/productpagedata", (req, res) => {
  const searchQuery = req.query.search ? req.query.search : "";
  const sql = "SELECT * FROM products WHERE name LIKE ?";
  db.query(sql, [`%${searchQuery}%`], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(result);
  });
});

app.post("/combinedfilter", (req, res) => {
  const {
    brands,
    tags,
    category,
    minPrice,
    maxPrice,
    sort,
    color,
    size,
    boxes,
    weight,
  } = req.body;
  let sql = `SELECT * FROM products WHERE 1=1`;
  let params = [];

  if (tags && tags.length > 0) {
    const tagPlaceholders = tags.map(() => "?").join(",");
    sql += ` AND tags IN (${tagPlaceholders})`;
    params.push(...tags);
  }

  if (brands && brands.length > 0) {
    const brandPlaceholders = brands.map(() => "?").join(",");
    sql += ` AND brand IN (${brandPlaceholders})`;
    params.push(...brands);
  }

  if (color && color !== "") {
    sql += ` AND attribute LIKE ?`;
    params.push(`%${color}%`);
  }

  if (size && size !== "") {
    sql += ` AND attribute LIKE ?`;
    params.push(`%${size}%`);
  }

  if (boxes && boxes !== "") {
    sql += ` AND attribute LIKE ?`;
    params.push(`%${boxes}%`);
  }

  if (weight && weight !== "") {
    sql += ` AND attribute LIKE ?`;
    params.push(`%${weight}%`);
  }

  if (category && category !== "") {
    sql += ` AND categories LIKE ?`;
    params.push(`%${category}%`);
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    sql += `
      AND CAST(REPLACE(REPLACE(REPLACE(price, ',', ''), ' USD', ''), '$', '') AS DECIMAL(10, 2))
      BETWEEN ? AND ?
    `;
    params.push(minPrice, maxPrice);
  }

  switch (sort) {
    case "Oldest":
      sql += " ORDER BY date DESC";
      break;
    case "Newest":
      sql += " ORDER BY date ASC";
      break;
    case "Price: low to high":
      sql += `
        ORDER BY CAST(REPLACE(REPLACE(REPLACE(price, ',', ''), ' USD', ''), '$', '') AS DECIMAL(10, 2)) ASC
      `;
      break;
    case "Price: high to low":
      sql += `
        ORDER BY CAST(REPLACE(REPLACE(REPLACE(price, ',', ''), ' USD', ''), '$', '') AS DECIMAL(10, 2)) DESC
      `;
      break;
    case "Name: A-Z":
      sql += " ORDER BY id ASC";
      break;
    case "Name: Z-A":
      sql += " ORDER BY id DESC";
      break;
    default:
      break;
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Combined filter error:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.json(result);
  });
});

app.delete("/deleteproductsdata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from products where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.get("/productsearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM products where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.put("/productupdate/:id", upload.single("file"), (req, res) => {
  const {
    name,
    permalink,
    description,
    content,
    sku,
    price,
    price_sale,
    cost,
    barcode,
    stockstatus,
    weight,
    length,
    wide,
    height,
    status,
    store,
    featured,
    brand,
    minimumorder,
    maximumorder,
    date,
    label,
    label1,
    tags,
    categories,
    attribute,
    faqs,
  } = req.body;

  const id = req.params.id;
  const image = req.file ? req.file.filename : null;

  let sql = `
    UPDATE products SET
      name=?, permalink=?, description=?,content=?, sku=?, price=?, price_sale=?, cost=?,
      barcode=?, stockstatus=?, weight=?, length=?, wide=?, height=?, status=?, store=?,
      featured=?, brand=?, minimumorder=?, maximumorder=?, date=?, label=?, label1=?, tags=?, categories=?,attribute=?,faqs=?
  `;
  let values = [
    name,
    permalink,
    description,
    content,
    sku,
    price,
    price_sale,
    cost,
    barcode,
    stockstatus,
    weight,
    length,
    wide,
    height,
    status,
    store,
    featured,
    brand,
    minimumorder,
    maximumorder,
    date,
    label,
    label1,
    tags,
    categories,
    attribute,
    faqs,
  ];

  if (image) {
    sql += ", image=?";
    values.push(image);
  }

  sql += " WHERE id = ?";
  values.push(id);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating product:", err);
      return res.status(500).send("Error updating data");
    }
    res.send("Product updated successfully.");
  });
});

app.get("/productsomedata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM products where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.put("/productpriceupdate/:id", (req, res) => {
  const { cost, price, price_sale } = req.body;
  const { id } = req.params;
  if (cost === undefined || price === undefined || price_sale === undefined) {
    return res.status(400).send("Missing required fields");
  }
  const sql =
    "UPDATE products SET cost = ?, price = ?, price_sale = ? WHERE id = ?";
  db.query(sql, [cost, price, price_sale, id], (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      return res.status(500).send("Internal server error");
    }
    res.send("Data updated successfully");
  });
});

app.post("/product-category", upload.single("file"), async (req, res) => {
  try {
    const payload = {};
    const fields = [
      "name",
      "permalink",
      "parent",
      "description",
      "status",
      "is_featured",
    ];

    fields.forEach((field) => {
      const val = req.body[field];
      payload[field] = val !== undefined && val !== "" ? val : null;
    });

    if (req.file) {
      payload.image = req.file.filename;
    }

    if (!payload.name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const sql = "INSERT INTO product_category SET ?";
    await db.query(sql, [payload]);

    res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (err) {
    console.error("Error inserting product category:", err);
    res.status(500).json({
      success: false,
      message: "Server error while creating category",
    });
  }
});

app.get("/productcatdata", (req, res) => {
  const sql = "select *from product_category";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/categoriesdelete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from product_category where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.put("/categoriesupdate/:id", upload.single("file"), (req, res) => {
  const id = req.params.id;
  const {
    name,
    permalink,
    parent,
    description,
    status,
    is_featured,
    isImageRemoved,
  } = req.body;

  let imageSql = "";
  const values = [name, permalink, parent, description, status, is_featured];

  if (req.file) {
    imageSql = ", image=?";
    values.push(req.file.filename);
  } else if (isImageRemoved === "true") {
    imageSql = ", image=NULL";
  }

  const sql = `UPDATE product_category 
               SET name=?, permalink=?, parent=?, description=?, status=?, is_featured=?${imageSql} 
               WHERE id=?`;
  values.push(id);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("SQL error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Category Update failed" });
    }
    res.json({ success: true, message: "Category updated successfully" });
  });
});

app.put("/productinventory/:id", (req, res) => {
  const { minimumorder } = req.body;
  const { id } = req.params;
  if (minimumorder === undefined) {
    return res.status(400).send("Missing required fields");
  }
  const parsedMinimumOrder = parseInt(minimumorder, 10);
  if (isNaN(parsedMinimumOrder)) {
    return res.status(400).send("Invalid value for minimumorder");
  }
  const sql = "UPDATE products SET minimumorder = ? WHERE id = ?";
  db.query(sql, [parsedMinimumOrder, id], (err, result) => {
    if (err) {
      return res.status(500).send("Internal server error");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Product not found or nothing to update");
    }
    res.send("Data updated successfully");
  });
});

app.get("/exportexcel-productdata", async (req, res) => {
  try {
    db.query("SELECT * FROM products", async (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        res.status(500).send("Error querying the database.");
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");

      if (results.length > 0) {
        const filteredResults = results.map(
          ({ password, confirmpassword, ...rest }) => {
            Object.keys(rest).forEach((key) => {
              if (typeof rest[key] === "string") {
                rest[key] = rest[key].replace(/<[^>]*>/g, "");
              }
            });
            return rest;
          }
        );

        worksheet.columns = Object.keys(filteredResults[0]).map((key) => ({
          header: key,
          key: key,
        }));

        filteredResults.forEach((row) => worksheet.addRow(row));
      } else {
        worksheet.addRow(["No data available"]);
      }

      res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      await workbook.xlsx.write(res);
      res.end();
    });
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).send("Error generating Excel file.");
  }
});

app.post("/menusubmit", (req, res) => {
  const { name, locations, items, date, status } = req.body;
  const value = [[name, locations, items, date, status]];
  const sql = "insert into menus(name,locations,items,date,status)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/menusdata", (req, res) => {
  const sql = "SELECT * FROM menus";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/menusearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM menus where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/menusdelete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from menus where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.get("/menusomedata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM menus where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.put("/menusupdate/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const sql = "update menus set ? where id=?";
  db.query(sql, [data, id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data updated");
    }
  });
});

app.get("/order-export", async (req, res) => {
  try {
    db.query(
      `
      SELECT 
        checkout.*, 
        cart_items.store
      FROM 
        checkout
      LEFT JOIN 
        cart_items 
      ON 
        checkout.id = cart_items.checkout_id
    `,
      async (err, results) => {
        if (err) {
          console.error("Database query error:", err);
          res.status(500).send("Error querying the database.");
          return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");
        if (results.length > 0) {
          worksheet.columns = Object.keys(results[0]).map((key) => ({
            header: key,
            key: key,
          }));
          results.forEach((row) => worksheet.addRow(row));
        } else {
          worksheet.addRow(["No data available"]);
        }
        res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        await workbook.xlsx.write(res);
        res.end();
      }
    );
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).send("Error generating Excel file.");
  }
});

app.post("/userdashboard", (req, res) => {
  const { name, phone, email, country, state, city, address } = req.body;
  const value = [[name, phone, email, country, state, city, address]];
  const sql =
    "insert into dashboard(name,phone,email,country,state,city,address)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/userdashboarddata", (req, res) => {
  const sql = "SELECT * FROM dashboard";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/deleteuser/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from dashboard where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.put("/dashboardedit/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const sql = "update dashboard set ? where id=?";
  db.query(sql, [data, id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data updated");
    }
  });
});

app.get("/dashboardsome/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM dashboard where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.put("/userupdated/:id", (req, res) => {
  const { first_name, last_name, dob, phone_number } = req.body;
  if (!first_name || !last_name || !dob || !phone_number) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const [first, ...lastParts] = first_name.split(" ");
  const last = lastParts.join(" ");
  const sql =
    "UPDATE user SET first_name=?, last_name=?, dob=?, phone_number=? WHERE id=?";
  db.query(
    sql,
    [first, last, dob, phone_number, req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update data" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "Data updated successfully" });
    }
  );
});

app.put("/changepassword/:id", (req, res) => {
  const { currentPassword, password } = req.body;
  const userId = req.params.id;
  const sql = "SELECT * FROM user WHERE id = ?";
  db.query(sql, [userId], async (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    const user = result[0];
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const updateSql = "UPDATE user SET password = ? WHERE id = ?";
    db.query(updateSql, [hashedPassword, userId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error("Error updating password:", updateErr);
        return res.status(500).json({ error: "Failed to update password" });
      }
      res.json({ message: "Password changed successfully!" });
    });
  });
});

app.post("/vendorshop", (req, res) => {
  const { shop_name, shop_url, shop_phone } = req.body;
  const value = [[shop_name, shop_url, shop_phone]];
  const sql = "insert into vendor(shop_name, shop_url, shop_phone)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/vendordata", (req, res) => {
  const sql = "SELECT * FROM dashboard";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/addcart", (req, res) => {
  let { user_id, name, store, price, price_sale, image, quantity } = req.body;

  const qty = Math.max(1, parseInt(quantity, 10) || 1);

  function normalizePrice(p) {
    if (typeof p !== "string" && typeof p !== "number") return null;
    const cleaned = String(p).replace(/[^0-9.]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num.toFixed(2);
  }

  const cleanPriceSale = normalizePrice(price_sale);
  const cleanPrice = normalizePrice(price);

  if (
    !user_id ||
    isNaN(parseInt(user_id, 10)) ||
    !name ||
    !store ||
    cleanPrice === null ||
    cleanPriceSale === null ||
    !image
  ) {
    return res
      .status(400)
      .send(
        "Invalid or missing fields. Make sure user_id is a number and price(s) are valid."
      );
  }

  user_id = parseInt(user_id, 10);

  const checkSql = `
    SELECT quantity 
    FROM cart 
    WHERE user_id = ? AND name = ? AND store = ?
  `;
  db.query(checkSql, [user_id, name, store], (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).send("Error checking cart.");
    }

    if (results.length > 0) {
      const existingQty = results[0].quantity;
      const newQty = existingQty + qty;

      const updateSql = `
        UPDATE cart 
        SET quantity = ?
        WHERE user_id = ? AND name = ? AND store = ?
      `;
      db.query(updateSql, [newQty, user_id, name, store], (err2) => {
        if (err2) {
          console.error("DB Error:", err2);
          return res.status(500).send("Error updating cart.");
        }
        return res.send("Cart item quantity updated successfully");
      });
    } else {
      const insertSql = `
        INSERT INTO cart 
          (user_id, name, store, price, price_sale, image, quantity)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        user_id,
        name,
        store,
        cleanPrice,
        cleanPriceSale,
        image,
        qty,
      ];
      db.query(insertSql, params, (err3) => {
        if (err3) {
          console.error("DB Error:", err3);
          return res.status(500).send("Error inserting to cart.");
        }
        return res.send("Cart item added successfully");
      });
    }
  });
});

app.get("/allcartdata", (req, res) => {
  const sql = "SELECT * FROM cart";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/dashboardsome/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM cart";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/deletecart/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM cart WHERE id=?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    if (result.affectedRows > 0) {
      return res.json({ success: true, message: "data deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
  });
});

app.delete("/deleteorder", (req, res) => {
  const sql = "DELETE FROM cart";
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("An error occurred while deleting the orders");
    } else {
      res.send("All data deleted");
    }
  });
});

app.get("/customerdata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM cart where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/cartsearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM products where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/specification", (req, res) => {
  const { name, description, date } = req.body;
  const value = [[name, description, date]];
  const sql = "insert into group1(name,description,date)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/spceficationdata", (req, res) => {
  const sql = "SELECT * FROM group1";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/specificationdelete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from group1 where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.get("/specificationsearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM group1 where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/spceficationdatasome/:id", (req, res) => {
  let id = req.params.id;
  const sql = "SELECT * FROM group1 where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.put("/spceficationupdate/:id", (req, res) => {
  let id = req.params.id;
  const data = req.body;
  const sql = "UPDATE group1 set ? WHERE id=?";
  db.query(sql, [data, id], (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send("Data updated");
    }
  });
});

app.post("/specificationtable", (req, res) => {
  const { name, description, date, display } = req.body;
  const value = [[name, description, date, display]];
  const sql = "INSERT INTO group2 (name, description, date, display) VALUES ?";

  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("Data submitted successfully");
    }
  });
});

app.get("/spceficationtabledata", (req, res) => {
  const sql = "SELECT * FROM group2";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/specificationdeletetable/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from group2 where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.get("/spceficationdatasometable/:id", (req, res) => {
  let id = req.params.id;
  const sql = "SELECT * FROM group2 where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.put("/spceficationupdatetable/:id", (req, res) => {
  let id = req.params.id;
  const data = req.body;
  const sql = "UPDATE group2 set ? WHERE id=?";
  db.query(sql, [data, id], (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send("Data updated");
    }
  });
});

app.get("/specificationtablesearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM group2 where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/specificationattribute", (req, res) => {
  const { groupname, name, fieldtype, valuegroup, date } = req.body;
  const value = [[groupname, name, fieldtype, valuegroup, date]];
  const sql =
    "INSERT INTO group3 (groupname, name, fieldtype, valuegroup,date) VALUES ?";

  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("Data submitted successfully");
    }
  });
});

app.get("/spceficationattributedata", (req, res) => {
  const sql = "SELECT * FROM group3";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/specificationdeleteattribute/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from group3 where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.get("/spceficationdatasomeattribute/:id", (req, res) => {
  let id = req.params.id;
  const sql = "SELECT * FROM group3 where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});
app.put("/spceficationupdateattribute/:id", (req, res) => {
  let id = req.params.id;
  const data = req.body;
  const sql = "UPDATE group3 set ? WHERE id=?";
  db.query(sql, [data, id], (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send("Data updated");
    }
  });
});

app.get("/specificationattributesearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM group3 where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/wishlistpost", (req, res) => {
  const {
    product_name,
    image,
    store,
    price,
    price_sale,
    sku,
    stockstatus,
    user_id,
  } = req.body;

  if (
    !product_name ||
    !image ||
    !store ||
    !price ||
    !price_sale ||
    !sku ||
    !stockstatus ||
    !user_id
  ) {
    return res.status(400).send("Missing required fields");
  }

  const sql = `
    INSERT INTO wishlist
      (user_id, product_name, image, store, price, price_sale, sku, stockstatus)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    user_id,
    product_name,
    image,
    store,
    price,
    price_sale,
    sku,
    stockstatus,
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).send("Database error");
    }
    res.send("Product added to wishlist successfully");
  });
});

app.get("/wishlistdata", (req, res) => {
  const sql = "SELECT * FROM wishlist";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/wishlistdelete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from wishlist where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.post("/adminlogin", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Both username (or email) and password are required." });
  }
  const sql = `
    SELECT * 
    FROM adminlogin 
    WHERE username = ? OR email = ?
    LIMIT 1
  `;
  db.query(sql, [username, username], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error." });
    if (!rows.length)
      return res.status(400).json({ error: "email/username is incorrect." });
    const userRow = rows[0];
    bcrypt.compare(password, userRow.password, (bcryptErr, isMatch) => {
      if (bcryptErr)
        return res.status(500).json({ error: "Authentication error." });
      if (!isMatch)
        return res.status(400).json({ error: "email/username is incorrect." });
      db.query(
        "UPDATE adminlogin SET last_login = NOW() WHERE id = ?",
        [userRow.id],
        () => {
          const expiresInDays = userRow.role === "superadmin" ? 365 : 7;
          const token = jwt.sign(
            {
              userId: userRow.id,
              username: userRow.username,
              role: userRow.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: `${expiresInDays}d` }
          );
          res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: expiresInDays * 24 * 60 * 60 * 1000,
            sameSite: "Strict",
          });

          return res.json({
            message:
              userRow.role === "superadmin"
                ? "Logged in as Super Admin"
                : "Logged in as Admin",
            user: {
              id: userRow.id,
              username: userRow.username,
              email: userRow.email,
              first_name: userRow.first_name,
              last_name: userRow.last_name,
              role: userRow.role,
            },
            token,
            expiresIn: expiresInDays * 24 * 60 * 60,
          });
        }
      );
    });
  });
});

app.post("/adminregister", async (req, res) => {
  const { first_name, last_name, email, role, username, password } = req.body;

  if (!first_name || !last_name || !email || !role || !username || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertSql = `
      INSERT INTO adminlogin
        (username, password, role, last_login, first_name, last_name, email)
      VALUES (?, ?, ?, NOW(), ?, ?, ?)
    `;
    db.query(
      insertSql,
      [username, hashedPassword, role, first_name, last_name, email],
      (err, result) => {
        if (err) {
          console.error("DB error on adminregister:", err);
          return res.status(500).json({ error: "Internal server error." });
        }
        return res.status(201).json({
          message: "Admin registered successfully.",
          userId: result.insertId,
        });
      }
    );
  } catch (hashErr) {
    console.error("Error hashing password:", hashErr);
    return res.status(500).json({ error: "Error processing password." });
  }
});

app.get("/alladmindata", (req, res) => {
  const sql = "select *from adminlogin";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/admindelete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from adminlogin where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
  });
});

app.put("/adminupdate/:id", async (req, res) => {
  const id = req.params.id;
  const { currentPassword, confirmpassword, ...updateData } = req.body;
  db.query(
    "SELECT password FROM adminlogin WHERE id = ?",
    [id],
    async (err, rows) => {
      if (err) return res.status(500).json({ error: "DB error" });
      if (!rows.length)
        return res.status(404).json({ error: "User not found" });

      const hashed = rows[0].password;
      const ok = await bcrypt.compare(currentPassword || "", hashed);
      if (!ok) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      if (updateData.password) {
        try {
          updateData.password = await bcrypt.hash(
            updateData.password,
            saltRounds
          );
        } catch (hashErr) {
          return res.status(500).json({ error: "Error hashing new password" });
        }
      } else {
        delete updateData.password;
      }
      db.query(
        "UPDATE adminlogin SET ? WHERE id = ?",
        [updateData, id],
        (uErr) => {
          if (uErr) return res.status(500).json({ error: "Update failed" });
          res.json({ message: "Admin updated successfully" });
        }
      );
    }
  );
});

app.get("/adminsomedata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "select * from adminlogin where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/adminsearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "SELECT * FROM adminlogin WHERE username LIKE ? OR email LIKE ?";
  db.query(sql, [`%${data}%`, `%${data}%`], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database query failed" });
    } else {
      res.json(result);
    }
  });
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "xyz@gmail.com",
    pass: "1111111",
  },
  debug: true,
});

function sendResetPasswordEmail(email, resetToken) {
  const resetLink = `http://89.116.170.231:5173/admin/password/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: "pkumar@jainya.com",
    to: email,
    subject: "Password Reset Request",
    html: `<p>You requested a password reset. Please click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  const sql = "SELECT * FROM adminlogin WHERE username = ?";
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).send("Database error");
    }
    if (result.length === 0) {
      return res.status(404).send("Email not found");
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiration = Date.now() + 3600000;
    const updateSql =
      "UPDATE adminlogin SET reset_token = ?, reset_token_expiration = ? WHERE username = ?";
    db.query(updateSql, [resetToken, resetTokenExpiration, email], (err) => {
      if (err) {
        console.error("Error updating reset token:", err);
        return res.status(500).send("Error updating reset token");
      }
      sendResetPasswordEmail(email, resetToken);
      res.send("Password reset link has been sent to your email");
    });
  });
});

app.post("/reset-password", (req, res) => {
  const { token, newPassword } = req.body;
  const sql =
    "SELECT * FROM adminlogin WHERE reset_token = ? AND reset_token_expiration > ?";
  db.query(sql, [token, Date.now()], (err, result) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).send("Database error");
    }
    if (result.length === 0) {
      return res.status(400).send("Invalid or expired reset token");
    }
    bcrypt.hash(newPassword, salt, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing the password:", err);
        return res.status(500).send("Error hashing the password");
      }
      const updateSql =
        "UPDATE adminlogin SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE reset_token = ?";
      db.query(updateSql, [hashedPassword, token], (err) => {
        if (err) {
          console.error("Error updating the password:", err);
          return res.status(500).send("Error updating the password");
        }
        res.send("Password has been reset successfully");
      });
    });
  });
});

app.get("/forgot-password", (req, res) => {
  const { username } = req.body;
  const sql = "SELECT * FROM adminlogin where username=?";
  db.query(sql, [username], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/get-font-settings", (req, res) => {
  db.query("SELECT * FROM settings LIMIT 1", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) {
      return res.json({
        font_family: "Arial",
        body_font_size: "14px",
        h1_font_size: "36px",
        h2_font_size: "32px",
        h3_font_size: "28px",
        h4_font_size: "24px",
        h5_font_size: "20px",
        h6_font_size: "16px",
      });
    }
    res.json(result[0]);
  });
});

app.post("/update-font-settings", (req, res) => {
  const {
    font_family,
    body_font_size,
    h1_font_size,
    h2_font_size,
    h3_font_size,
    h4_font_size,
    h5_font_size,
    h6_font_size,
  } = req.body;
  db.query("SELECT * FROM settings LIMIT 1", (err, result) => {
    if (err) {
      console.error("Error fetching existing settings:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Settings not found" });
    }
    const existingSettings = result[0];
    const updatedSettings = {
      font_family: font_family || existingSettings.font_family,
      body_font_size: body_font_size || existingSettings.body_font_size,
      h1_font_size: h1_font_size || existingSettings.h1_font_size,
      h2_font_size: h2_font_size || existingSettings.h2_font_size,
      h3_font_size: h3_font_size || existingSettings.h3_font_size,
      h4_font_size: h4_font_size || existingSettings.h4_font_size,
      h5_font_size: h5_font_size || existingSettings.h5_font_size,
      h6_font_size: h6_font_size || existingSettings.h6_font_size,
    };
    const sql = `
      UPDATE settings 
      SET 
        font_family = ?, 
        body_font_size = ?, 
        h1_font_size = ?, 
        h2_font_size = ?, 
        h3_font_size = ?, 
        h4_font_size = ?, 
        h5_font_size = ?, 
        h6_font_size = ?
    `;
    db.query(sql, Object.values(updatedSettings), (updateErr, updateResult) => {
      if (updateErr) {
        console.error("Error updating font settings:", updateErr);
        return res.status(500).json({ error: "Update failed" });
      }
      res.json({
        success: true,
        message: "Font settings updated successfully!",
      });
    });
  });
});

app.post(
  "/update-settings",
  upload.fields([
    { name: "favicon" },
    { name: "logo" },
    { name: "logo_light" },
  ]),
  (req, res) => {
    const logo_height = req.body.logo_height;
    const favicon_url = req.files["favicon"]
      ? req.files["favicon"][0].filename
      : null;
    const logo_url = req.files["logo"] ? req.files["logo"][0].filename : null;
    const logo_light = req.files["logo_light"]
      ? req.files["logo_light"][0].filename
      : null;
    let sql = "UPDATE logo SET";
    let params = [];
    if (favicon_url) {
      sql += " favicon_url=?,";
      params.push(favicon_url);
    }
    if (logo_url) {
      sql += " logo_url=?,";
      params.push(logo_url);
    }
    if (logo_light) {
      sql += " logo_light=?,";
      params.push(logo_light);
    }
    if (logo_height) {
      sql += " logo_height=?,";
      params.push(logo_height);
    }
    sql = sql.replace(/,$/, "");
    sql += " WHERE id=1";
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database update failed!" });
      }
      res.json({ success: true, message: "Settings updated successfully!" });
    });
  }
);

app.get("/get-theme-logo", (req, res) => {
  db.query("SELECT * FROM logo LIMIT 1", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) {
      return res.json({ result });
    }
    res.json(result[0]);
  });
});

app.post("/breadcrumb-settings", upload.single("file"), (req, res) => {
  let {
    enable_breadcrumb,
    breadcrumb_style,
    hide_title,
    background_color,
    breadcrumb_height,
    mobile_length,
    imageDeleted,
  } = req.body;

  let newBackgroundImage;
  if (imageDeleted === "true") {
    newBackgroundImage = null;
  } else if (req.file) {
    newBackgroundImage = req.file.filename;
  } else {
    newBackgroundImage = undefined;
  }
  let query;
  let params;
  if (newBackgroundImage === undefined) {
    query = `
      UPDATE breadcrumb 
      SET 
        enable_breadcrumb = COALESCE(NULLIF(?, ''), enable_breadcrumb),
        breadcrumb_style = COALESCE(NULLIF(?, ''), breadcrumb_style),
        hide_title = COALESCE(NULLIF(?, ''), hide_title),
        background_color = COALESCE(NULLIF(?, ''), background_color),
        breadcrumb_height = COALESCE(NULLIF(?, ''), breadcrumb_height),
        mobile_length = COALESCE(NULLIF(?, ''), mobile_length)
      WHERE id = 1
    `;
    params = [
      enable_breadcrumb,
      breadcrumb_style,
      hide_title,
      background_color,
      breadcrumb_height,
      mobile_length,
    ];
  } else {
    query = `
      UPDATE breadcrumb 
      SET 
        enable_breadcrumb = COALESCE(NULLIF(?, ''), enable_breadcrumb),
        breadcrumb_style = COALESCE(NULLIF(?, ''), breadcrumb_style),
        hide_title = COALESCE(NULLIF(?, ''), hide_title),
        background_color = COALESCE(NULLIF(?, ''), background_color),
        breadcrumb_height = COALESCE(NULLIF(?, ''), breadcrumb_height),
        mobile_length = COALESCE(NULLIF(?, ''), mobile_length),
        background_image = ?
      WHERE id = 1
    `;
    params = [
      enable_breadcrumb,
      breadcrumb_style,
      hide_title,
      background_color,
      breadcrumb_height,
      mobile_length,
      newBackgroundImage,
    ];
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database update failed" });
    }
    res
      .status(200)
      .json({ message: "Breadcrumb settings updated successfully" });
  });
});

app.get("/get-theme-breadcrumb", (req, res) => {
  db.query("SELECT * FROM breadcrumb LIMIT 1", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) {
      return res.json({ result });
    }
    res.json(result[0]);
  });
});

app.post("/themenewspost", upload.single("file"), (req, res) => {
  let {
    news_popup,
    popup_title,
    popup_subtitle,
    popup_description,
    popup_delay,
    display_page,
    deleteImage,
  } = req.body;
  const image = req.file ? req.file.filename : null;
  popup_delay =
    popup_delay && !isNaN(popup_delay) ? parseInt(popup_delay, 10) : 0;
  const displayPages = Array.isArray(display_page)
    ? display_page.join(",")
    : display_page;
  const sql = "SELECT * FROM themenews WHERE id = 1";
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (rows.length === 0)
      return res.status(404).json({ error: "Record not found" });
    const updatedFields = {};
    if (news_popup !== undefined) updatedFields.news_popup = news_popup;
    if (popup_title !== undefined) updatedFields.popup_title = popup_title;
    if (popup_subtitle !== undefined)
      updatedFields.popup_subtitle = popup_subtitle;
    if (popup_description !== undefined)
      updatedFields.popup_description = popup_description;
    if (popup_delay !== undefined) updatedFields.popup_delay = popup_delay;
    if (displayPages !== undefined) updatedFields.display_page = displayPages;
    if (deleteImage === "true") {
      updatedFields.image = "";
    } else if (image !== null) {
      updatedFields.image = image;
    }
    const setClause = Object.keys(updatedFields)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updatedFields);
    if (setClause.length === 0)
      return res.json({ message: "No changes made." });
    const updateQuery = `UPDATE themenews SET ${setClause} WHERE id = 1`;
    db.query(updateQuery, values, (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ message: "Data successfully updated", result });
    });
  });
});

app.get("/themenewsdata", (req, res) => {
  db.query("SELECT * FROM themenews LIMIT 1", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) {
      return res.json({ result });
    }
    res.json(result[0]);
  });
});

app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  const { endpoint, keys } = subscription;
  const ipAddress = req.headers["x-forwarded-for"]
    ? req.headers["x-forwarded-for"].split(",")[0].trim()
    : req.ip;
  const sql = `INSERT INTO subscriptions (endpoint, p256dh, auth, ip_address, created_at)
    VALUES (?, ?, ?, ?, NOW())`;
  db.query(
    sql,
    [endpoint, keys.p256dh, keys.auth, ipAddress],
    (err, results) => {
      if (err) {
        console.error("Error storing subscription:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({ message: "Subscription stored successfully" });
    }
  );
});

function sendPushNotification(message) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM subscriptions", (err, subscriptions) => {
      if (err) return reject(err);

      const notifications = subscriptions.map((sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        };
        return webpush
          .sendNotification(pushSubscription, JSON.stringify(message))
          .catch((error) => {
            if (error.statusCode === 410) {
              db.query("DELETE FROM subscriptions WHERE endpoint = ?", [
                sub.endpoint,
              ]);
            } else {
              console.error("Push error:", error);
            }
          });
      });

      Promise.all(notifications)
        .then(() => resolve())
        .catch(reject);
    });
  });
}

app.get("/vapidPublicKey", (req, res) => {
  res.set({
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.send(publicVapidKey);
});

function sendPushNotification(message) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM subscriptions", (err, subscriptions) => {
      if (err) {
        return reject(err);
      }
      const notifications = subscriptions.map((subscription) => {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        };
        const payload = JSON.stringify(message);
        return webpush
          .sendNotification(pushSubscription, payload)
          .catch((error) => {
            if (error.statusCode === 410) {
              db.query(
                "DELETE FROM subscriptions WHERE endpoint = ?",
                [subscription.endpoint],
                (err) => {
                  if (err) {
                    console.error("Error removing subscription:", err);
                  }
                }
              );
            } else {
              console.error("Error sending notification:", error);
            }
          });
      });
      Promise.all(notifications)
        .then(() => resolve())
        .catch(reject);
    });
  });
}
module.exports = { sendPushNotification };

app.post("/updateSettings", (req, res) => {
  const fieldsToUpdate = {};
  const allowedFields = [
    "stickyHeader",
    "stickyHeaderMobile",
    "bottomMenuBarMobile",
    "backToTopButton",
    "primaryColor",
    "headerBackgroundColor",
    "headerTextColor",
    "headerMainColor",
    "headerMainTextColor",
    "headerMenu",
    "headerBorder",
    "headerMenuTextColor",
    "headerStyle",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      fieldsToUpdate[field] = req.body[field];
    }
  });

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res
      .status(400)
      .json({ error: "No valid fields provided for update" });
  }

  const setClause = Object.keys(fieldsToUpdate)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = Object.values(fieldsToUpdate);
  const sql = `UPDATE header SET ${setClause} WHERE id = 1`;
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating settings:", err);
      return res.status(500).json({ error: "Failed to update settings" });
    }
    res.json({ message: "Settings updated successfully" });
  });
});

app.get("/themestylesdata", (req, res) => {
  db.query("SELECT * FROM header LIMIT 1", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) {
      return res.json({ result });
    }
    res.json(result[0]);
  });
});

app.post(
  "/theme-options",
  upload.fields([
    { name: "seoOgImage", maxCount: 1 },
    { name: "lazyPlaceholderImage", maxCount: 1 },
  ]),
  (req, res) => {
    const {
      site_title,
      site_name,
      title_separator,
      seo_title,
      seo_description,
      seo_index,
      terms_url,
      copyright,
      enable_preloader,
      preloader_version,
    } = req.body;
    const seoOgFile = req.files["seoOgImage"]
      ? req.files["seoOgImage"][0]
      : null;
    const lazyPlaceholderFile = req.files["lazyPlaceholderImage"]
      ? req.files["lazyPlaceholderImage"][0]
      : null;
    let seoVal;
    if (req.body.seoOgImage === "") {
      seoVal = "";
    } else if (seoOgFile) {
      seoVal = seoOgFile.filename;
    } else {
      seoVal = req.body.seoOgImage;
    }
    let lazyVal;
    if (req.body.lazyPlaceholderImage === "") {
      lazyVal = "";
    } else if (lazyPlaceholderFile) {
      lazyVal = lazyPlaceholderFile.filename;
    } else {
      lazyVal = req.body.lazyPlaceholderImage;
    }
    const query = `
      UPDATE theme_options SET
        site_title = ?,
        site_name = ?,
        title_separator = ?,
        seo_title = ?,
        seo_description = ?,
        seo_index = ?,
        terms_url = ?,
        copyright = ?,
        enable_preloader = ?,
        preloader_version = ?,
        seo_og_image_url = CASE ? 
                              WHEN '' THEN NULL 
                              ELSE ? 
                           END,
        lazy_placeholder_image = CASE ? 
                                    WHEN '' THEN NULL 
                                    ELSE ? 
                                 END
      WHERE id = 1
    `;

    const values = [
      site_title,
      site_name,
      title_separator,
      seo_title,
      seo_description,
      seo_index,
      terms_url,
      copyright,
      enable_preloader,
      preloader_version,

      seoVal,
      seoVal,
      lazyVal,
      lazyVal,
    ];

    db.query(query, values, (err, results) => {
      if (err) {
        console.error("Error saving theme options:", err);
        return res.status(500).json({ error: "Failed to save theme options" });
      }
      return res.json({
        message: "Theme options saved successfully",
        results,
      });
    });
  }
);

app.get("/themeoptionsdata", (req, res) => {
  db.query("SELECT * FROM theme_options LIMIT 1", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) {
      return res.json({ result });
    }
    res.json(result[0]);
  });
});

app.post("/save-custom-code", (req, res) => {
  const {
    custom_css,
    header_html,
    body_html,
    footer_html,
    header_js,
    body_js,
    footer_js,
  } = req.body;

  const query = `
    UPDATE custom_code 
    SET 
      custom_css = COALESCE(?, custom_css),
      header_html = COALESCE(?, header_html),
      body_html = COALESCE(?, body_html),
      footer_html = COALESCE(?, footer_html),
      header_js = COALESCE(?, header_js),
      body_js = COALESCE(?, body_js),
      footer_js = COALESCE(?, footer_js)
    WHERE id = 1
  `;

  db.query(
    query,
    [
      custom_css,
      header_html,
      body_html,
      footer_html,
      header_js,
      body_js,
      footer_js,
    ],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Custom code updated successfully" });
    }
  );
});

app.get("/get-custom-code", (req, res) => {
  db.query("SELECT * FROM custom_code LIMIT 1", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(
      results[0] || {
        custom_css: "",
        header_html: "",
        body_html: "",
        footer_html: "",
        header_js: "",
        body_js: "",
        footer_js: "",
      }
    );
  });
});

app.post("/ads-settings", adsUpload.single("adsTxtFile"), (req, res) => {
  const snippet = req.body.googleAdsenseAutoAdsSnippet;
  const clientId = req.body.googleAdsenseUnitAdsClientID;
  const file = req.file;

  if (
    !file ||
    ((!snippet || snippet.trim() === "") &&
      (!clientId || clientId.trim() === ""))
  ) {
    return res.status(400).json({
      message:
        "Missing required fields. Please upload the .txt file and provide at least one: the Ad Snippet or the Client ID.",
    });
  }

  if (
    !file.mimetype.includes("text/plain") &&
    !file.originalname.endsWith(".txt")
  ) {
    return res.status(400).json({
      message: "Invalid file type. Only .txt files are allowed.",
    });
  }

  const settings = {
    googleAdsenseAutoAdsSnippet: snippet,
    googleAdsenseUnitAdsClientID: clientId,
    adsTxtFile: {
      filename: "ads.txt",
      url: `/images/ads.txt`,
      originalName: file.originalname,
    },
  };

  try {
    fs.writeFileSync(
      path.join(__dirname, "ads-settings.json"),
      JSON.stringify(settings, null, 2)
    );
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error saving settings.", error: err });
  }

  res.json({ message: "Ads settings saved successfully!", settings });
});

app.delete("/ads-settings", (req, res) => {
  const settingsFilePath = path.join(__dirname, "ads-settings.json");
  if (!fs.existsSync(settingsFilePath)) {
    return res.status(404).json({ message: "No settings found." });
  }
  const data = fs.readFileSync(settingsFilePath);
  const settings = JSON.parse(data);
  if (!settings.adsTxtFile || !settings.adsTxtFile.filename) {
    return res.status(400).json({ message: "No file found in settings." });
  }
  const filePath = path.join(publicFolder, settings.adsTxtFile.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found on disk." });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return res.status(500).json({ message: "Error deleting file." });
    }
    settings.adsTxtFile = null;
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
    res.json({ message: "File deleted successfully!" });
  });
});

app.get("/ads-settings", (req, res) => {
  const settingsFile = path.join(__dirname, "ads-settings.json");

  if (fs.existsSync(settingsFile)) {
    try {
      const data = fs.readFileSync(settingsFile, "utf8");
      const settings = JSON.parse(data);
      return res.json(settings);
    } catch (error) {
      console.error("Error reading or parsing settings file:", error);
      return res.status(500).json({ message: "Error reading settings file." });
    }
  } else {
    return res.json({});
  }
});

app.post("/cookiepost", (req, res) => {
  const {
    cookie,
    style,
    message,
    button_text,
    learn_url,
    learn_text,
    backgroundColor,
    textColor,
    width,
  } = req.body;
  const recordId = 1;
  const checkSql = "SELECT * FROM cookie WHERE id = ?";
  db.query(checkSql, [recordId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length > 0) {
      const updateSql = `
        UPDATE cookie 
        SET cookie = ?, style = ?, message = ?, button_text = ?, learn_url = ?, learn_text = ?, backgroundColor = ?, textColor = ?, width = ?
        WHERE id = ?
      `;
      db.query(
        updateSql,
        [
          cookie,
          style,
          message,
          button_text,
          learn_url,
          learn_text,
          backgroundColor,
          textColor,
          width,
          recordId,
        ],
        (err, updateResult) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.send("Data updated");
        }
      );
    } else {
      const insertSql = `
        INSERT INTO cookie (id, cookie, style, message, button_text, learn_url, learn_text, backgroundColor, textColor, width)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertSql,
        [
          recordId,
          cookie,
          style,
          message,
          button_text,
          learn_url,
          learn_text,
          backgroundColor,
          textColor,
          width,
        ],
        (err, insertResult) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.send("Data submitted");
        }
      );
    }
  });
});

app.get("/cookiesalldata", (req, res) => {
  db.query("SELECT * FROM cookie LIMIT 1", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) {
      return res.json({ result });
    }
    res.json(result[0]);
  });
});

app.get("/track", (req, res) => {
  let ip =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";

  ip = ip.split(",")[0].trim();

  const isLocal =
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.");

  const geo = geoip.lookup(ip);
  let countryCode = geo && /^[A-Z]{2}$/.test(geo.country) ? geo.country : null;

  if (isLocal && !countryCode) {
    countryCode = "IN";
  }

  const userAgent = req.headers["user-agent"] || "unknown";
  const page = req.query.page || "/";

  const query = `
    INSERT INTO visits (ip_address, user_agent, page, country_code)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [ip, userAgent, page, countryCode], (err) => {
    if (err) {
      console.error("Error inserting visit:", err);
      return res.status(500).json({ error: "DB insert error" });
    }

    db.query("SELECT COUNT(*) AS total FROM visits", (err, results) => {
      if (err) return res.status(500).json({ error: "DB count error" });
      res.json({ total: results[0].total });
    });
  });
});

app.get("/analytics", (req, res) => {
  const query = `
    WITH allHours AS (
      SELECT 0 AS hour
      UNION ALL SELECT 1
      UNION ALL SELECT 3
      UNION ALL SELECT 5
      UNION ALL SELECT 7
      UNION ALL SELECT 9
      UNION ALL SELECT 11
      UNION ALL SELECT 13
      UNION ALL SELECT 15
      UNION ALL SELECT 17
      UNION ALL SELECT 19
      UNION ALL SELECT 21
      UNION ALL SELECT 23
    )
    SELECT 
      allHours.hour AS hoursAgo,
      COALESCE(COUNT(v.id), 0) AS pageviews,
      COALESCE(COUNT(DISTINCT v.ip_address), 0) AS visitors
    FROM allHours
    LEFT JOIN visits v 
      ON FLOOR(TIMESTAMPDIFF(HOUR, v.visited_at, NOW())) = allHours.hour 
      AND v.visited_at >= NOW() - INTERVAL 1 DAY
    GROUP BY allHours.hour
    ORDER BY allHours.hour;
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching analytics:", err);
      return res.status(500).json({ error: "DB error" });
    }
    res.json(results);
  });
});

app.get("/summary", (req, res) => {
  const query = `
    SELECT 
      COUNT(DISTINCT ip_address) AS totalVisitors,
      COUNT(*) AS totalPageviews
    FROM visits
    WHERE visited_at >= NOW() - INTERVAL 1 DAY
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching summary analytics:", err);
      return res.status(500).json({ error: "DB error" });
    }
    res.json(results[0]);
  });
});

app.get("/country-visits", (req, res) => {
  const query = `
    SELECT country_code, COUNT(*) AS visitors
    FROM visits
    WHERE visited_at >= NOW() - INTERVAL 1 DAY
    GROUP BY country_code
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching country visits:", err);
      return res.status(500).json({ error: "DB error" });
    }

    const data = {};
    results.forEach((row) => {
      if (row.country_code && row.country_code !== "Unknown") {
        data[row.country_code] = row.visitors;
      }
    });

    res.json(data);
  });
});

async function fetchTranslation(original, lang) {
  const sql = `
    SELECT translated_text FROM translations WHERE original_text = ? AND lang = ? LIMIT 1
  `;
  const [rows] = await db.execute(sql, [original, lang]);
  return (rows[0] && rows[0].translated_text) || original;
}

app.post("/translate", async (req, res) => {
  try {
    const { texts, lang } = req.body;

    console.log("API hit - lang:", lang);
    console.log("Received texts:", texts);

    const uniqueTexts = [...new Set(texts)];
    const map = {};

    await Promise.all(
      uniqueTexts.map(async (txt) => {
        const translation = await fetchTranslation(txt, lang);
        console.log(`Translating: "${txt}" -> "${translation}"`);
        map[txt] = translation;
      })
    );

    const translations = texts.map((txt) => map[txt]);
    return res.json({ translations });
  } catch (err) {
    console.error("Translate API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/allthemesdata", (req, res) => {
  const sql = "select *from themes";
  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "DB error" });
    }
    res.json(results);
  });
});

app.listen(1600, "0.0.0.0", () => {
  console.log("server is running on port 1600");
});
