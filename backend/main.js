require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { ppid } = require("process");
const PDFDocument = require("pdfkit");
const app = express();
const salt = 10;

app.use(
  cors({
    origin: "http://50.18.56.183",
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/src/image", express.static(path.join(__dirname, "src/image")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

const uploadDir = path.join(__dirname, "src/image");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

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
            <script type="module" src="/src/main.jsx"></script> 
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
  bcrypt.hash(password.toString(), salt, (err, hash) => {
    if (err) return res.json({ Error: "Password hashing error" });
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

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM user WHERE email=?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ Error: "Login error" });
    }
    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].password,
        (err, response) => {
          if (err) {
            console.error("Error comparing password:", err);
            return res.status(500).json({ Error: "Password compare error" });
          }
          if (response) {
            let name = data[0].first_name;
            let token = jwt.sign({ name }, "jwt-secret-key", {
              expiresIn: "1d",
            });
            res.cookie("token", token, {
              httpOnly: true,
              secure: false,
              sameSite: "None",
              maxAge: 86400000,
            });
            return res
              .status(200)
              .json({ Status: "Success", message: "Login successful" });
          } else {
            console.log("Password not matched.");
            return res.status(400).json({ Error: "Password not matched" });
          }
        }
      );
    } else {
      console.log("No user found with the email.");
      return res.status(404).json({ Error: "No user with the provided email" });
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" });
  res.send({ Status: "Success", message: "Logged out successfully" });
});

app.get("/changepassword/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM user WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ Error: "Database error" });
    }
    res.json(result);
  });
});

app.get("/alldata", (req, res) => {
  const sql = "select *from user";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.put("/passwordupdate/:id", (req, res) => {
  const id = req.params.id;
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ Error: "Both current and new passwords are required" });
  }
  const sql = "SELECT * FROM user WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ Error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ Error: "User not found" });
    }
    const user = result[0];
    bcrypt.compare(currentPassword, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ Error: "Password comparison error" });
      }
      if (!isMatch) {
        return res.status(400).json({ Error: "Current password is incorrect" });
      }
      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing new password:", err);
          return res.status(500).json({ Error: "Password hashing error" });
        }
        const updateSql = "UPDATE user SET password = ? WHERE id = ?";
        db.query(updateSql, [hashedPassword, id], (err, result) => {
          if (err) {
            console.error("Error updating password:", err);
            return res.status(500).json({ Error: "Database error" });
          }
          if (result.affectedRows > 0) {
            res.json({
              Status: "Success",
              Message: "Password updated successfully!",
            });
          } else {
            res.status(404).json({ Error: "User not found" });
          }
        });
      });
    });
  });
});

app.get("/check-auth", (req, res) => {
  const sql = "select *from user";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// checkout

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
  } = req.body;
  const getLatestInvoiceSql = `
    SELECT invoice_number FROM checkout
    ORDER BY id DESC LIMIT 1
  `;
  db.query(getLatestInvoiceSql, (err, result) => {
    if (err) {
      console.error("Error retrieving latest invoice number:", err);
      return res.status(500).send("Error retrieving invoice number");
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
        country, pincode, date, subtotal, tax, shippingfee, total, invoice_number
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const checkoutValues = [
      email,
      phone_number,
      first_name,
      last_name,
      address,
      apartment,
      country,
      pincode,
      date,
      subtotal,
      tax,
      shippingFee,
      total,
      newInvoiceNumber,
    ];

    db.query(checkoutSql, checkoutValues, (err, result) => {
      if (err) {
        console.error("Error inserting checkout data:", err);
        return res.status(500).send("Error submitting data");
      }

      const checkoutId = result.insertId;
      const orderNumber = `#${checkoutId + 1000}`;

      const updateOrderNumberSql = `
        UPDATE checkout
        SET order_number = ?
        WHERE id = ?
      `;
      db.query(updateOrderNumberSql, [orderNumber, checkoutId], (err) => {
        if (err) {
          console.error("Error updating order number:", err);
          return res.status(500).send("Error updating order number");
        }
        const cartSql = `
          INSERT INTO cart_items (
            checkout_id, image, name, quantity, price, subtotal, tax, store
          ) 
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
            console.error("Error inserting cart data:", err);
            return res.status(500).send("Error submitting cart data");
          }
          res.send({
            message: "Data successfully submitted",
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
    select
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

// checkout

app.delete("/deleteorder1/:id", (req, res) => {
  let id = req.params.id;
  console.log(`Attempting to delete order with ID: ${id}`);
  const sqlDeleteCartItems = "DELETE FROM cart_items WHERE checkout_id = ?";
  const sqlDeleteCheckout = "DELETE FROM checkout WHERE id = ?";
  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction failed to start:", err);
      return res.status(500).json({ error: "Transaction failed to start" });
    }
    console.log(`Deleting cart items for checkout_id: ${id}`);
    db.query(sqlDeleteCartItems, [id], (err, result) => {
      if (err) {
        console.error("Error deleting cart items:", err);
        return db.rollback(() => {
          res.status(500).json({ error: "Failed to delete cart items" });
        });
      }
      console.log(
        `Deleted ${result.affectedRows} cart items for checkout_id: ${id}`
      );
      console.log(`Deleting checkout record with ID: ${id}`);
      db.query(sqlDeleteCheckout, [id], (err, result) => {
        if (err) {
          console.error("Error deleting checkout record:", err);
          return db.rollback(() => {
            res.status(500).json({ error: "Failed to delete checkout record" });
          });
        }
        console.log(
          `Deleted ${result.affectedRows} checkout record with ID: ${id}`
        );
        db.commit((err) => {
          if (err) {
            console.error("Transaction commit failed:", err);
            return db.rollback(() => {
              res.status(500).json({ error: "Transaction commit failed" });
            });
          }
          console.log(`Transaction committed successfully`);
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
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  let email = req.body.email;
  let phone_number = req.body.phone_number;
  let product = req.body.product;
  let message = req.body.message;
  let value = [[first_name, last_name, email, phone_number, product, message]];
  let sql =
    "insert into contact(first_name,last_name,email,phone_number,product,message)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
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
  const sql = "select *from announce";
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
  const sql = "select *from announce where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/search/:value", (req, res) => {
  const data = req.params.value;
  const sql = "select *from announce where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// Testimonials

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
  const sql = "select *from testimonial";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/testifilter/:value", (req, res) => {
  const data = req.params.value;
  const sql = "select *from testimonial where name like ?";
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
  const sql = "select *from testimonial where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// Galleries

app.post("/gallerypost", upload.single("file"), (req, res) => {
  const name = req.body.name;
  const permalink = req.body.permalink;
  const orders = req.body.orders;
  const date = req.body.date;
  const feature = req.body.feature;
  const status = req.body.status;
  const image = req.file.filename;
  let value = [[name, permalink, orders, date, feature, status, image]];
  const sql =
    "insert into gallery(name,permalink,orders,date,feature,status,image)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/gallerydata", (req, res) => {
  const sql = "select *from gallery";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/galleryfil/:value", (req, res) => {
  const data = req.params.value;
  const sql = "select *from gallery where name like ?";
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
  const { name, permalink, orders, date, feature, status } = req.body;
  const id = req.params.id;
  const image = req.file ? req.file.filename : null;
  let sql =
    "update gallery set name = ?, permalink = ?, orders = ?, date = ?, feature= ?, status= ?";
  let values = [name, permalink, orders, date, feature, status];
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
  const sql = "select *from gallery where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// simple-sliders

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
  const sql = "select *from sliders";
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
  const sql = "select *from sliders where name like ?";
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
  const sql = "select *from sliders where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// excel.js

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

// contactus

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
  const sql = "select *from contactus";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/export-excelcontact", async (req, res) => {
  try {
    db.query("SELECT * FROM contactus", async (err, results) => {
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
  const sql = "select *from contactus where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/contactsearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "select *from contactus where name like ?";
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

// pages page

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
  const sql = "select *from pages";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
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

// 1111111111111

app.get("/pagesomedata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "select *from pages where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/pagesearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "select *from pages where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// faqs backend

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
  const sql = "select *from faqback";
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
  const sql = "select *from faqback where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/faqsearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "select *from faqback where question like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// faqs category

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
  const sql = "select *from faqcategory";
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
  const sql = "select *from faqcategory where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/faqsearchcategory/:value", (req, res) => {
  const data = req.params.value;
  const sql = "select *from faqcategory where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// blog

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
  const sql = "select *from blogtags";
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
  const sql = "select *from blogtags where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/blogtagsearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "select *from blogtags where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// blogpost

app.post("/blogpostsubmit", upload.single("file"), (req, res) => {
  const name = req.body.name;
  const author_name = req.body.author_name;
  const permalink = req.body.permalink;
  const description = req.body.description;
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
      feature,
      status,
      categories,
      date,
      image,
    ],
  ];
  const sql =
    "insert into blogpost(name,author_name,permalink,description,feature,status,categories,date,image)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/blogpostdata", (req, res) => {
  const sql = "select *from blogpost";
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
    feature,
    status,
    categories,
    date,
  } = req.body;
  const id = req.params.id;
  const image = req.file ? req.file.filename : null;
  let sql =
    "update blogpost set name = ?, author_name=?, permalink = ?,description=?,feature= ?, status= ?,categories=?, date = ?";
  let values = [
    name,
    author_name,
    permalink,
    description,
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
  const sql = "select *from blogpost where id=?";
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
  const sql = "select *from blogpost where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// ads

app.post("/adspost", upload.single("file"), (req, res) => {
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
  const image = req.file.filename;
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
    ],
  ];
  const sql =
    "insert into ads(name,title,subtitle,button,keyads,orders,adstype,status,expired,image)values ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("data submitted");
    }
  });
});

app.get("/adsdata", (req, res) => {
  const sql = "select *from ads";
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
  const sql = "select *from ads where id=?";
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
  const sql = "select *from ads where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// ECOMMERCE
// product tags

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
  const sql = "select *from producttags";
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
  const sql = "select *from producttags where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/searchtags/:value", (req, res) => {
  const data = req.params.value;
  const sql = "select *from producttags where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// order returns

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

// product collections

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
  const sql = "select *from productcollection";
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
  const sql = "select *from productcollection where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
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
  const sql = "select *from productcollection where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// productlabels

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
  const sql = "select *from productlabels";
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
  const sql = "select *from productlabels where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/productlabelsdata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "select *from productlabels where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// brands

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
  const sql = "select *from brands";
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
  const sql = "select *from brands where name like ?";
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
  const sql = "select *from brands where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// product options

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
  const sql = "select *from productoptions";
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
  const sql = "select *from productoptions where name like ?";
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
  const sql = "select *from productoptions where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// product attributes

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
  const sql = "select *from productattribute";
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
  const sql = "select *from productattribute where title like ?";
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
  const sql = "select *from productattribute where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// flash sales

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
  const sql = "select *from flashsales";
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
  const sql = "select *from flashsales where name like ?";
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
  const sql = "select *from flashsales where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// customers

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
  const sql = "select *from customers";
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
  const sql = "select *from user where first_name like ?";
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

app.get("/somecustomerdata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "select *from user where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// customer popup

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
  const sql = "select *from customerpopup";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// Reviews

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
  const sql = "select *from reviews";
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
  const sql = "select *from reviews where product_name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/reviewsomedata/:id", (req, res) => {
  const id = req.params.id;
  const sql = "select *from reviews where id=?";
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

// discounts page

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
  const sql = "select *from discounts";
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
  const sql = "select *from discounts where couponcode like ?";
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
  const sql = "select *from discounts where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// products page

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
  const sql =
    "INSERT INTO products (name, permalink, description, sku, price, price_sale, cost, barcode, stockstatus, weight, length, wide, height, status, store, featured, brand, minimumorder, maximumorder, date, image, label,label1) VALUES ?";

  db.query(sql, [value], (err, result) => {
    if (err) {
      console.error("Error inserting product:", err);
      return res.status(500).send("Error inserting data");
    } else {
      res.send("Data submitted successfully");
    }
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
  const sql = "select *from products where name like ?";
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
  const sql = "select *from products where id=?";
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

// excel data

app.get("/exportexcel-productdata", async (req, res) => {
  try {
    db.query("select * from products", async (err, results) => {
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

// appearence menus

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
  const sql = "select *from menus";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/menusearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "select *from menus where name like ?";
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
  const sql = "select *from menus where id=?";
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

// orders excel export

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

// user dashboard

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
  const sql = "select *from dashboard";
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
  const sql = "select *from dashboard where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.put("/userupdate/1", (req, res) => {
  const data = req.body;
  const sql = "UPDATE dashboard SET name=?, date=?, phone=? WHERE id=1";
  db.query(sql, [data.name, data.date, data.phone], (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send("Data updated");
    }
  });
});

// User vendor

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
  const sql = "select *from dashboard";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// add to cart

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

// add to cart

app.get("/allcartdata", (req, res) => {
  const sql = "select *from cart";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/dashboardsome/:id", (req, res) => {
  const id = req.params.id;
  const sql = "select *from cart";
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
  const sql = "select *from cart where id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/cartsearch/:value", (req, res) => {
  const data = req.params.value;
  const sql = "select *from products where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

// product specification

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
  const sql = "select *from group1";
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
  const sql = "select *from group1 where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/spceficationdatasome/:id", (req, res) => {
  let id = req.params.id;
  const sql = "select *from group1 where id=?";
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

//  specification tables

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
  const sql = "select *from group2";
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
  const sql = "select *from group2 where id=?";
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
  const sql = "select *from group2 where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

//  specification attributes

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
  const sql = "select *from group3";
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
  const sql = "select *from group3 where id=?";
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
  const sql = "select *from group3 where name like ?";
  db.query(sql, ["%" + data + "%"], (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.post("/wishlistpost", upload.single("file"), (req, res) => {
  const { product_name, image } = req.body;
  if (!product_name || !image) {
    return res.status(400).send("Missing required fields");
  }
  const value = [[product_name, image]];
  const sql = "INSERT INTO wishlist(product_name, image) VALUES ?";
  db.query(sql, [value], (err, result) => {
    if (err) throw err;
    else {
      res.send("Product added to wishlist successfully");
    }
  });
});

app.get("/wishlistdata", (req, res) => {
  const sql = "select *from wishlist";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.listen(1600, "0.0.0.0", () => {
  console.log("server is running on port 1600");
});
