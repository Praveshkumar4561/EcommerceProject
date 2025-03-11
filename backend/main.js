require("dotenv").config();
const express = require("express");
const prerender = require("prerender-node");
const { SitemapStream, streamToPromise } = require("sitemap");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { ppid } = require("process");
const webpush = require("web-push");
const PDFDocument = require("pdfkit");
const app = express();
const salt = 10;
const saltRounds = 10;

app.use(
  cors({
    origin: "",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

prerender.set("prerenderToken", "LNOpIKN4lFVCHLfv1lca");
app.use(prerender);
app.use(express.static(path.join(__dirname, "../frontend1/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend1/dist", "index.html"));
});

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/src/image", express.static(path.join(__dirname, "src/image")));
app.set("trust proxy", true);

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

const uploadDir = path.join(__dirname, "src/image");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use("/uploads", express.static(uploadDir));

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

const publicVapidKey =
  "BPJVSJMYeYgCD13-Sv8ziP9m6ecOBSc8KfIJ055G9wsCmE80aYWKPEUKkamseWpIkorpD3-Vs3NLBmBLvXEASGI";
const privateVapidKey = "h2r9X6cwNN1GxczN_e9N2Ggh0Ap3jcrmfBhWmW9xNX8";

webpush.setVapidDetails(
  "mailto:your-email@example.com",
  publicVapidKey,
  privateVapidKey
);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
});

db.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log("database connected");
  }
});

const getCurrentLastMod = () => new Date().toISOString();

const links = [
  { url: "/", lastmodISO: getCurrentLastMod(), priority: 1.0 },
  { url: "/about", lastmodISO: getCurrentLastMod(), priority: 0.9 },
  { url: "/shop", lastmodISO: getCurrentLastMod(), priority: 0.9 },
  { url: "/blog", lastmodISO: getCurrentLastMod(), priority: 0.9 },
  { url: "/product/details", lastmodISO: getCurrentLastMod(), priority: 0.9 },
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
      hostname: "http://srv724100.hstgr.cloud",
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

app.get("/page-seo/:id", (req, res) => {
  const pageId = req.params.id;

  const query = "SELECT * FROM pagesseo WHERE id = ?";
  db.query(query, [pageId], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      const pageData = results[0];
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${pageData.title}</title>
            <meta property="og:title" content="${pageData.og_title}" />
            <meta property="og:description" content="${pageData.og_description}" />
            <meta property="og:image" content="${pageData.og_image}" />
            <meta property="og:url" content="http://yourwebsite.com/page-seo/${pageId}" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css" rel="stylesheet"/>
        </head>
        <body>
            <h1>${pageData.title}</h1>
            <div>${pageData.content}</div>
        </body>
        </html>
      `);
    } else {
      res.status(404).send("Page not found");
    }
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
  const { first_name, last_name, phone_number, email, password } = req.body;
  bcrypt.hash(password.toString(), saltRounds, (err, hash) => {
    if (err) {
      console.error("Password hashing error:", err);
      return res.status(500).json({ Error: "Password hashing error" });
    }
    const value = [[first_name, last_name, phone_number, email, hash]];
    const sql =
      "INSERT INTO user(first_name, last_name, phone_number, email, password) VALUES ?";
    db.query(sql, [value], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.json({ Error: "Error while inserting data" });
      }
      let token = jwt.sign({ email }, "jwt-secret-key", { expiresIn: "1d" });
      res.clearCookie("token");
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "None",
        maxAge: 86400000,
        path: "/",
      });
      res.json({ Status: "Success", message: "User signed up successfully!" });
    });
  });
});

// const secret = crypto.randomBytes(64).toString('hex');
// console.log(secret);

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
            Status: "Success",
            message: "Login successful",
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

app.get("/allreviewdata", async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .execute("SELECT * FROM user ORDER BY id ASC LIMIT 4");
    res.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
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
    status,
  } = req.body;
  if (!cart || cart.length === 0) {
  }
  const getLatestInvoiceSql = `SELECT invoice_number FROM checkout ORDER BY id DESC LIMIT 1`;
  db.query(getLatestInvoiceSql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error retrieving invoice number" });
    }
    let newInvoiceNumber = "INV-1031";
    if (result.length > 0) {
      const lastInvoiceNumber = result[0].invoice_number;
      const lastInvoiceNumberParts = lastInvoiceNumber.split("-");
      const lastInvoiceNumberInt = parseInt(lastInvoiceNumberParts[1], 10);
      newInvoiceNumber = `INV-${lastInvoiceNumberInt + 1}`;
    }
    const checkoutSql = `
      INSERT INTO checkout (
        email, phone_number, first_name, last_name, address, apartment, 
        country, pincode, date, subtotal, tax, shippingFee, total, invoice_number,payment,status
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
    `;
    const checkoutValues = [
      email || null,
      phone_number || null,
      first_name || null,
      last_name && last_name !== "" ? last_name : null,
      address || null,
      apartment || null,
      country || null,
      pincode ? pincode : null,
      date || null,
      subtotal || null,
      tax || null,
      shippingFee || null,
      total || null,
      newInvoiceNumber || null,
      payment || null,
      status || null,
    ];

    db.query(checkoutSql, checkoutValues, (err, result) => {
      if (err) {
        console.error("Error inserting checkout data:", err);
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
          item.image,
          item.name,
          item.quantity,
          item.price,
          item.subtotal,
          item.tax,
          item.store,
        ]);
        db.query(cartSql, [cartValues], (err) => {
          if (err) {
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
  let id = req.params.id;
  const sqlDeleteCartItems = "DELETE FROM cart_items WHERE checkout_id = ?";
  const sqlDeleteCheckout = "DELETE FROM checkout WHERE id = ?";
  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction failed to start:", err);
      return res.status(500).json({ error: "Transaction failed to start" });
    }
    db.query(sqlDeleteCartItems, [id], (err, result) => {
      if (err) {
        console.error("Error deleting cart items:", err);
        return db.rollback(() => {
          res.status(500).json({ error: "Failed to delete cart items" });
        });
      }

      db.query(sqlDeleteCheckout, [id], (err, result) => {
        if (err) {
          console.error("Error deleting checkout record:", err);
          return db.rollback(() => {
            res.status(500).json({ error: "Failed to delete checkout record" });
          });
        }
        db.commit((err) => {
          if (err) {
            console.error("Transaction commit failed:", err);
            return db.rollback(() => {
              res.status(500).json({ error: "Transaction commit failed" });
            });
          }
          res.send("Order and associated cart items deleted successfully.");
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
  const name = req.body.name;
  const subject = req.body.subject;
  const message = req.body.message;
  let value = [[name, subject, message]];
  let sql = "insert into faqs(name,subject,message)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/contact", (req, res) => {
  const name = req.body.name;
  let email = req.body.email;
  let address = req.body.address;
  let phone = req.body.phone;
  let subject = req.body.subject;
  let content = req.body.content;
  let value = [[name, email, address, phone, subject, content]];
  let sql =
    "insert into contact(name, email, address, phone, subject, content)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
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
  const sql = "update announce set ? where id=?";
  db.query(sql, [data, id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data updated");
    }
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
  const image = req.file.filename;
  const value = [[name, company, status, date, content, image]];
  const sql =
    "insert into testimonial (name, company, status, date,content,image) VALUES ?";
  db.query(sql, [value], (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send("Data submitted successfully.");
    }
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
  const sql = "SELECT * FROM faqback";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
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
  const sql = "delete from faqback where id=?";
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
      image,
    ],
  ];

  const sql = `INSERT INTO blogpost
    (name, author_name, permalink, description, content, feature, status, categories, date, image)
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
  } = req.body;
  const id = req.params.id;
  const image = req.file ? req.file.filename : null;
  let sql =
    "update blogpost set name = ?, author_name=?, permalink = ?,description=?,content=?,feature= ?, status= ?,categories=?, date = ?";
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
      expired,
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
        expired,
        image,
        desktopImage,
        mobileImage,
      ],
    ];

    const sql =
      "INSERT INTO ads (name, title, subtitle, button, keyads, orders, adstype, status, expired, image, desktopImage, mobileImage) VALUES ?";

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

app.put("/adsupdate/:id", upload.single("file"), (req, res) => {
  const {
    name,
    title,
    subtitle,
    button,
    keyads,
    orders,
    adstype,
    status,
    expired,
  } = req.body;
  const id = req.params.id;
  const image = req.file ? req.file.filename : null;
  let sql =
    "update ads set name=?,title=?, subtitle=?,button=?,keyads=?,orders=?, adstype=?,status=?,expired=?";
  let values = [
    name,
    title,
    subtitle,
    button,
    keyads,
    orders,
    adstype,
    status,
    expired,
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
  const { name, date, status, featured } = req.body;
  const value = [[name, date, status, featured]];
  const sql = "insert into productoptions(name,date,status,featured)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
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
  const id = req.params.id;
  const data = req.body;
  const sql = "update productoptions set ? where id=?";
  db.query(sql, [data, id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data updated");
    }
  });
});

app.get("/optionsomedata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM productoptions where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/productattributes", (req, res) => {
  const { title, slug, sort, status, date } = req.body;
  const value = [[title, slug, sort, status, date]];
  const sql =
    "insert into productattribute(title,slug,sort,status,date)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/attributesdata", (req, res) => {
  const sql = "SELECT * FROM productattribute";
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

app.put("/updateattributes/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const sql =
    "update productattribute set title=?, slug=?, sort=?, status=?, date=? where id=?";
  db.query(
    sql,
    [data.title, data.slug, data.sort, data.status, data.date, id],
    (err, result) => {
      if (err) throw err;
      else {
        res.send("Data updated");
      }
    }
  );
});

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
  const { name, start_date, status, end_date } = req.body;
  const value = [[name, start_date, status, end_date]];
  const sql = "insert into flashsales(name,start_date,status,end_date)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/flashsalesdata", (req, res) => {
  const sql = "SELECT * FROM flashsales";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.delete("/flashsaledelete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "delete from flashsales where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
    }
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
  const { name, start_date, status, end_date } = req.body;
  const sql =
    "update flashsales set name=?, start_date=?, status=?, end_date=? where id=?";
  db.query(sql, [name, start_date, status, end_date, id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data updated");
    }
  });
});

app.get("/flashsalessome/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM flashsales where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
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

app.post("/reviewdatasubmit", upload.single("file"), (req, res) => {
  const { product_name, user_name, email, star, comment, status, date } =
    req.body;
  const image = req.file.filename;
  const value = [
    [product_name, user_name, email, star, comment, status, date, image],
  ];
  const sql =
    "insert into reviews(product_name,user_name,email,star,comment,status,date,image)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/reviewdata", (req, res) => {
  const sql = "SELECT * FROM reviews";
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
    ],
  ];
  const sql =
    "insert into discounts(discounttype,couponcode,coupontype,conditions,orders,start_date,end_date)values ?";
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
  } = req.body;
  const image = req.file ? req.file.filename : null;
  const value = [
    [
      name,
      permalink,
      description,
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
    ],
  ];
  const sql = `INSERT INTO products 
    (name, permalink, description, sku, price, price_sale, cost, barcode, stockstatus, weight, length, wide, height, status, store, featured, brand, minimumorder, maximumorder, date, image, label, label1)
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
  } = req.body;

  const id = req.params.id;
  const image = req.file ? req.file.filename : null;
  let sql =
    "UPDATE products SET name=?, permalink=?, description=?, sku=?, price=?, price_sale=?, cost=?, barcode=?, stockstatus=?, weight=?, length=?, wide=?, height=?, status=?, store=?, featured=?, brand=?, minimumorder=?, maximumorder=?, date=?, label=?,label1=?";

  let values = [
    name,
    permalink,
    description,
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

app.post("/addcart", upload.single("file"), (req, res) => {
  const { name, store, price, price_sale } = req.body;
  const image = req.body.image || req.file?.filename;

  if (!name || !store || !price || !price_sale || !image) {
    return res.status(400).send("Missing required fields.");
  }

  const value = [[name, store, price, price_sale, image]];
  const sql =
    "INSERT INTO cart (name, store, price, price_sale, image) VALUES ?";
  db.query(sql, [value], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Error while inserting data.");
    }
    res.send("Data submitted successfully");
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
  const sql = "delete from cart where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.send("data deleted");
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

app.post("/wishlistpost", upload.single("file"), (req, res) => {
  const { product_name, image, store, price, price_sale, sku } = req.body;
  if (!product_name || !image || !store || !price || !price_sale || !sku) {
    return res.status(400).send("Missing required fields");
  }
  const value = [[product_name, image, store, price, price_sale, sku]];
  const sql =
    "INSERT INTO wishlist(product_name, image,store,price,price_sale,sku) VALUES ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("Product added to wishlist successfully");
    }
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
    return res.status(400).send("Both username and password are required");
  }
  const sql = "SELECT * FROM adminlogin WHERE username = ?";
  db.query(sql, [username], (err, result) => {
    if (err) {
      return res.status(500).send("Internal server error");
    }
    if (result.length === 0) {
      return res.status(400).send("Invalid username or password.");
    }
    const hashedPassword = result[0].password;
    const role = result[0].role;
    const lastLogin = result[0].last_login;
    bcrypt.compare(password, hashedPassword, (err, isMatch) => {
      if (err) {
        return res.status(500).send("Error comparing passwords");
      }
      if (isMatch) {
        let expiresIn;
        let maxAge;
        const currentTime = new Date().getTime();
        let lastLoginTime = lastLogin
          ? new Date(lastLogin).getTime()
          : currentTime;
        if (role === "superadmin") {
          expiresIn = "365d";
          maxAge = 365 * 24 * 60 * 60 * 1000;
        } else if (role === "admin") {
          const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
          const timeElapsed = currentTime - lastLoginTime;
          if (timeElapsed < sevenDaysInMilliseconds) {
            expiresIn = (sevenDaysInMilliseconds - timeElapsed) / 1000;
            maxAge = expiresIn * 1000;
          } else {
            expiresIn = 7 * 24 * 60 * 60;
            maxAge = sevenDaysInMilliseconds;
          }
        }
        const sql = "UPDATE adminlogin SET last_login = ? WHERE username = ?";
        db.query(sql, [new Date(), username], (updateErr) => {
          if (updateErr) {
            return res.status(500).send("Error updating last login time");
          }
          const token = jwt.sign(
            { userId: result[0].id, username, role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );
          res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: maxAge,
            sameSite: "Strict",
          });
          return res.send({
            message:
              role === "superadmin"
                ? "Successfully logged in as Super Admin!"
                : "Successfully logged in as Admin!",
            user: result[0],
            token: token,
            expiresIn: expiresIn,
          });
        });
      } else {
        return res.status(400).send("Invalid username or password.");
      }
    });
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

app.listen(1600, "0.0.0.0", () => {
  console.log("server is running on port 1600");
});
