const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "***REMOVED***",
    host: "localhost",
    port: 5432,
    database: "nba_alerts"
});

module.exports = pool;