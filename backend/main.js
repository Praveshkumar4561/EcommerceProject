require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const router = require("./routes/router");
const app = express();

app.use(
  cors({
    origin: ["https://demo.webriefly.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(express.static(path.join(__dirname, "build"))); // new line of code
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "build", "index.html"))
); // new line of code

app.use("/frontend1", express.static(path.join(__dirname, "frontend1")));
app.use("/themes", express.static(path.join(__dirname, "themes")));
app.set("views", path.join(__dirname, "themes"));
app.set("views", path.join(__dirname, "themes/roiser-html-package/roiser"));

app.set(
  "views",
  path.join(
    __dirname,
    "themes/roiser-multipurpose-ecommerce-html5-template-2024-08-20-06-31-54-utc-2025-06-12-15-16-08-utc/roiser-html-package/roiser"
  )
);
app.use("/api", router);

app.listen(1600, "127.0.0.1", () => {
  console.log("server is running on port 1600");
});
