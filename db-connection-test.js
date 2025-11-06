// Database Connection Test Script
// This tests the direct PostgreSQL connection

console.log('=== Supabase PostgreSQL Connection Test ===\n');

// Connection details
const connectionDetails = {
    host: 'db.smgxivzlexhahfhlrlrp.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'Alihan', // You provided this password
    ssl: true
};

console.log('Connection Details:');
console.log(`Host: ${connectionDetails.host}`);
console.log(`Port: ${connectionDetails.port}`);
console.log(`Database: ${connectionDetails.database}`);
console.log(`User: ${connectionDetails.user}`);
console.log(`Password: ${connectionDetails.password ? '****' : 'NOT SET'}`);
console.log('');

// Note: To actually test this connection, you would need to install pg package:
// npm install pg
//
// Then uncomment the code below:

/*
const { Client } = require('pg');

async function testConnection() {
    const client = new Client(connectionDetails);
    
    try {
        console.log('Attempting to connect to database...');
        await client.connect();
        console.log('✅ Connection successful!\n');
        
        console.log('Checking if feedback table exists...');
        const result = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'feedback'
            )
        `);
        
        const tableExists = result.rows[0].exists;
        console.log(`Table 'feedback' exists: ${tableExists}\n`);
        
        if (tableExists) {
            console.log('Checking table structure...');
            const structure = await client.query(`
                SELECT column_name, data_type, is_nullable 
                FROM information_schema.columns 
                WHERE table_name = 'feedback' 
                ORDER BY ordinal_position
            `);
            
            console.log('Table structure:');
            structure.rows.forEach(row => {
                console.log(`  ${row.column_name} (${row.data_type}) ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
            });
            console.log('');
            
            console.log('Counting records...');
            const count = await client.query('SELECT COUNT(*) as count FROM feedback');
            console.log(`Total records: ${count.rows[0].count}\n`);
        } else {
            console.log('Creating feedback table...');
            await client.query(`
                CREATE TABLE IF NOT EXISTS feedback (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    message TEXT NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                )
            `);
            console.log('✅ Table created successfully\n');
        }
        
        console.log('Inserting test record...');
        const insert = await client.query(`
            INSERT INTO feedback (name, email, message) 
            VALUES ($1, $2, $3) 
            RETURNING *
        `, ['PostgreSQL Test', 'pgtest@example.com', 'Test from PostgreSQL connection']);
        
        console.log('✅ Test record inserted:', insert.rows[0]);
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('Code:', error.code);
    } finally {
        await client.end();
        console.log('\nConnection closed.');
    }
}

// Run the test
testConnection();
*/

console.log('To run this test:');
console.log('1. Save this file as db-connection-test.js');
console.log('2. Run: npm install pg');
console.log('3. Uncomment the code above');
console.log('4. Run: node db-connection-test.js');