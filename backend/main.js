require("dotenv").config();
const express = require("express");
const path = require("path");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const router = require("./routes/router"); 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());

app.use("/frontend1", express.static(path.join(__dirname, "frontend1")));
app.use("/themes", express.static(path.join(__dirname, "themes")));



app.use("/api", router);



app.listen(1600, "127.0.0.1", () => {
  console.log("server is running on port 1600");
});
