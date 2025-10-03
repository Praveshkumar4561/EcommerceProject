require("dotenv").config();
const express = require("express");
const router = require("./routes/router");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

app.listen(1600, "127.0.0.1", () => {
  console.log("server is running on port 1600");
});
