require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const originalQuery = pool.query.bind(pool);

pool.query = (sql, params, callback) => {
  if (typeof params === "function") {
    return originalQuery(sql, params);
  } else if (typeof callback === "function") {
    return originalQuery(sql, params, callback);
  } else {
    return pool.promise().query(sql, params);
  }
};

pool.execute = (sql, params, callback) => {
  if (typeof callback === "function") {
    return pool.getConnection((err, connection) => {
      if (err) return callback(err);
      connection.execute(sql, params, (err, results, fields) => {
        connection.release();
        callback(err, results, fields);
      });
    });
  } else {
    return pool.promise().execute(sql, params);
  }
};

pool.query("SELECT 1", (err) => {
  if (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  } else {
    console.log("Database connected");
  }
});

module.exports = pool;
