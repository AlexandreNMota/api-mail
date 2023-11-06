// db.js
const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const databaseConn = () => {
  db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });

  // db.connect((err) => {
  //   if (err) {
  //     console.error("MySQL connection error:", err);
  //     return;
  //   }
  //   console.log("Connected to MySQL database");
  // });
  return db;
};

module.exports = databaseConn; // Exporte o objeto de conexão
