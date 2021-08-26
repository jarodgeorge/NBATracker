const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "jewmuffin1",
    host: "localhost",
    port: 5432,
    database: "nba_alerts"
});

module.exports = pool;