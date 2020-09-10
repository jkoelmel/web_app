const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host:"localhost",
    user:"photoapp",
    password: "toor",
    database: "csc317db",
    connectionLimit: 50,
    waitForConnections: true,
    debug: false
})


module.exports = pool;