const mysql = require('mysql2/promise');
require('dotenv').config();

const {
  DB_NAME = 'digital_detox',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_HOST = 'localhost',
  DB_PORT = 3306
} = process.env;

async function testConnection() {
  try {
    console.log('Testing MySQL connection...');
    console.log(`Host: ${DB_HOST}`);
    console.log(`Port: ${DB_PORT}`);
    console.log(`User: ${DB_USER}`);
    console.log(`Database: ${DB_NAME}`);
    console.log(`Password: ${DB_PASSWORD ? '***' : '(empty)'}`);
    console.log('');

    // Test connection
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD
    });

    console.log('✓ Successfully connected to MySQL server!');

    // Check if database exists
    const [databases] = await connection.query('SHOW DATABASES LIKE ?', [DB_NAME]);
    if (databases.length > 0) {
      console.log(`✓ Database "${DB_NAME}" exists`);
    } else {
      console.log(`⚠ Database "${DB_NAME}" does not exist. It will be created automatically.`);
    }

    await connection.end();
    console.log('\n✓ Connection test successful!');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Connection failed!');
    console.error('Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure MySQL service is running');
    console.error('2. Check your DB_USER and DB_PASSWORD in backend/.env');
    console.error('3. Verify DB_HOST and DB_PORT are correct');
    console.error('4. If using MySQL Workbench, check the connection settings there');
    process.exit(1);
  }
}

testConnection();



