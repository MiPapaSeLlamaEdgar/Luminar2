// Importar dotenv para cargar variables de entorno
require('dotenv').config();

const config = {
  PORT: process.env.PORT || 5000,
  DB_HOST: process.env.DB_HOST || '127.0.0.1',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'Luminar',
  DB_PORT: process.env.DB_PORT || 3306,
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey',
  EMAIL_USER: process.env.EMAIL_USER || 'luminar.correo@gmail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'edea hhha azrt mjye',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

module.exports = config;