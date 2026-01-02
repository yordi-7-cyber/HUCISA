const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function initDatabase() {
    try {
        // Connect to MySQL server
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'antidrug_club_db',
            multipleStatements: true
        });

        console.log('Connected to MySQL database.');

        // Read SQL file
        const sqlPath = path.join(__dirname, '../database.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Execute SQL
        console.log('Executing database.sql...');
        await connection.query(sql);

        console.log('Database initialized successfully!');
        await connection.end();
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

initDatabase();
