const readline = require('readline');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupDatabase() {
  console.log('=== MySQL Database Setup ===\n');
  
  // Step 1: Get MySQL password
  console.log('To find your MySQL password:');
  console.log('1. Open MySQL Workbench');
  console.log('2. Look at your connection (usually "Local instance MySQL80")');
  console.log('3. If it connects, the password might be saved');
  console.log('4. Or check: Edit → Preferences → SQL Editor\n');
  
  const password = await question('Enter your MySQL root password (press Enter if no password): ');
  
  // Step 2: Update .env file
  const envPath = path.join(__dirname, '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update password in .env
  if (envContent.includes('DB_PASSWORD=')) {
    envContent = envContent.replace(/DB_PASSWORD=.*/, `DB_PASSWORD=${password}`);
  } else {
    envContent += `\nDB_PASSWORD=${password}`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('\n✓ Updated .env file with password\n');
  
  // Step 3: Test connection
  require('dotenv').config();
  const {
    DB_NAME = 'digital_detox',
    DB_USER = 'root',
    DB_PASSWORD = '',
    DB_HOST = 'localhost',
    DB_PORT = 3306
  } = process.env;
  
  try {
    console.log('Testing MySQL connection...');
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD || password
    });
    
    console.log('✓ Successfully connected to MySQL server!\n');
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`✓ Database "${DB_NAME}" is ready\n`);
    
    await connection.end();
    
    console.log('=== Setup Complete! ===\n');
    console.log('Next steps:');
    console.log('1. Run the server: npm run dev (from project root)');
    console.log('2. The server will automatically create all tables');
    console.log('3. Open MySQL Workbench and refresh to see the database');
    console.log('4. You should see these tables: users, trips, checkins, itineraries, rules, reviews\n');
    
  } catch (error) {
    console.error('\n✗ Connection failed!');
    console.error('Error:', error.message);
    console.error('\nPlease check:');
    console.error('1. MySQL service is running');
    console.error('2. Password is correct');
    console.error('3. MySQL Workbench connection settings\n');
  }
  
  rl.close();
}

setupDatabase();



