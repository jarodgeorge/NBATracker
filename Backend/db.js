require('dotenv').config();
const Pool = require("pg").Pool;
const postgres_password = process.env.POSTGRES_PW

const pool = new Pool({
    user: "postgres",
    password: postgres_password,
    host: "localhost",
    port: 5432,
    database: "nba_alerts"
});

module.exports = pool;
