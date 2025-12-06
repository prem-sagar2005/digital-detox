const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

const {
  DB_NAME = 'digital_detox',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_HOST = 'localhost',
  DB_PORT = 3306
} = process.env;

const ensureDatabaseExists = async () => {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  await connection.end();
};

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});

sequelize.ensureDatabaseExists = ensureDatabaseExists;

module.exports = sequelize;