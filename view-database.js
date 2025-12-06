const mysql = require('mysql2/promise');
require('dotenv').config();

const {
  DB_NAME = 'digital_detox',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_HOST = 'localhost',
  DB_PORT = 3306
} = process.env;

async function viewDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME
    });

    console.log('=== Digital Detox Database Status ===\n');
    
    // List all tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📊 Tables in database:');
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`   ${index + 1}. ${tableName}`);
    });
    
    console.log('\n=== Table Details ===\n');
    
    // Get row counts for each table
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ??`, [tableName]);
      const count = rows[0].count;
      console.log(`📋 ${tableName}: ${count} row(s)`);
      
      // Show table structure
      const [columns] = await connection.query(`DESCRIBE ??`, [tableName]);
      console.log(`   Columns: ${columns.map(c => c.Field).join(', ')}`);
      console.log('');
    }
    
    // Show sample data if any exists
    console.log('=== Sample Data ===\n');
    const [users] = await connection.query('SELECT userID, username, email, createdAt FROM users LIMIT 5');
    if (users.length > 0) {
      console.log('👤 Users:');
      users.forEach(user => {
        console.log(`   - ${user.username} (${user.email}) - Created: ${user.createdAt}`);
      });
    } else {
      console.log('👤 No users yet. Register through the web app to create one.');
    }
    
    console.log('');
    const [trips] = await connection.query('SELECT tripID, destination, status, createdAt FROM trips LIMIT 5');
    if (trips.length > 0) {
      console.log('✈️  Trips:');
      trips.forEach(trip => {
        console.log(`   - ${trip.destination} (${trip.status}) - Created: ${trip.createdAt}`);
      });
    } else {
      console.log('✈️  No trips yet. Create a trip through the web app.');
    }
    
    await connection.end();
    console.log('\n✓ Database connection successful!');
    console.log('\n💡 To view data in MySQL Workbench:');
    console.log('   1. Open MySQL Workbench');
    console.log('   2. Connect to your local MySQL instance');
    console.log('   3. Expand "Schemas" → "digital_detox" → "Tables"');
    console.log('   4. Right-click any table → "Select Rows" to view data');
    
  } catch (error) {
    console.error('\n✗ Error:', error.message);
  }
}

viewDatabase();



