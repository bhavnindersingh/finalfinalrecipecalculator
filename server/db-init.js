const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initializeDatabase() {
    try {
        // Read schema file
        const schema = fs.readFileSync('./schema.sql', 'utf8');
        
        // Execute schema
        await pool.query(schema);
        console.log('Database schema initialized successfully');

        // Add some sample data if needed
        await pool.query(`
            INSERT INTO ingredients (name, cost, unit, supplier) 
            VALUES 
            ('Flour', 2.50, 'kg', 'Local Supplier'),
            ('Sugar', 3.00, 'kg', 'Sweet Corp'),
            ('Eggs', 0.50, 'piece', 'Farm Fresh')
            ON CONFLICT DO NOTHING;
        `);
        console.log('Sample data inserted successfully');

    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await pool.end();
    }
}

initializeDatabase();
