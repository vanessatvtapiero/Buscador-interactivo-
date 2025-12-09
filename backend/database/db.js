import mysql from "mysql2/promise";

export const db = await mysql.createPool({
  host: "switchyard.proxy.rlwy.net",
  user: "root",
  password: "yrCwBDMEGwOAFBncFFfjFDxQXTKhKcrP",
  database: "railway",
  port: 51655,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
console.log("Conectado a la base de datos MySQL");