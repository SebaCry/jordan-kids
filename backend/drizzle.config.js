require('dotenv').config();

module.exports = {
  schema: './schemas/db.schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    user: process.env.POSTGRES_USER || 'jordanlist',
    password: process.env.POSTGRES_PASSWORD || 'jordanlist123',
    database: process.env.POSTGRES_DB || 'jordanlist_db',
  }
};
