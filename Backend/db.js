require('dotenv').config();
const Pool = require("pg").Pool;
const postgres_password = process.env.POSTGRES_PW
const postgres_url = process.env.POSTGRES_URL
const postgres_port = process.env.POSTGRES_PORT
const postgres_user = process.env.POSTGRES_USER
const postgres_db = process.env.POSTGRES_DB

const pool = new Pool({
    user: postgres_user,
    password: postgres_password,
    host: postgres_url,
    port: postgres_port,
    database: postgres_db
});

module.exports = pool;
