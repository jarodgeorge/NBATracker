const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "",
    host: "localhost",
    port: 5432,
    database: "nba_alerts"
});

module.exports = pool;
git filter-repo --invert-paths --path E:\Development\nbaTracker\Backend\db.js