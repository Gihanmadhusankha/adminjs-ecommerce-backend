import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbHost = process.env.DB_HOST || 'localhost';
if (!process.env.DB_HOST) {
  console.warn('Warning: DB_HOST not set. Falling back to localhost — set DB_HOST in .env for production.');
}

const sequelize = new Sequelize(
  process.env.DB_NAME || 'postgres',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: dbHost,
    dialect: 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
    logging: false,
  }
);

export default sequelize;