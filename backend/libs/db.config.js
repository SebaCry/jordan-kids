const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
require('dotenv').config();

// Configuración del pool de PostgreSQL
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'jordanlist',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'jordanlist_db',
  password: process.env.POSTGRES_PASSWORD || 'jordanlist123',
  port: process.env.POSTGRES_PORT || 5432,
});

// Instancia de Drizzle
const db = drizzle(pool);

module.exports = { db, pool };
