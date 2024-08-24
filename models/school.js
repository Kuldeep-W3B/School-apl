require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "school_management",
    port: 5432 
});

module.exports = pool;
