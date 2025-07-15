// src/config/database.ts
import path from 'path';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

// 1. Load .env (make sure this path is correct relative to this file)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// 2. Grab and normalize DATABASE_URL
let dbUrl = process.env.DATABASE_URL?.trim();
if (!dbUrl) {
  console.error('🛑 [DB ERROR] DATABASE_URL is not set – check your .env file!');
  process.exit(1);
}

// 3. Normalize the protocol so pg driver parses host correctly
if (dbUrl.startsWith('postgresql://')) {
  dbUrl = dbUrl.replace(/^postgresql:\/\//, 'postgres://');
}

// 4. DEBUG: make absolutely sure we have the right URL
console.log('🛠  [DB DEBUG] Will connect using:', dbUrl);

// 5. Create and export Sequelize instance
export const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,            // Neon requires SSL
      rejectUnauthorized: false // Neon uses self-signed certs
    }
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    underscored: true,
    timestamps: true
  }
});

export default sequelize;
