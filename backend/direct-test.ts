// This script directly tests the database connection
// Bypassing any issues with ts-node or environment variables

import { Sequelize } from 'sequelize';

// Direct connection URL
const databaseUrl = 'postgresql://neondb_owner:npg_LO9C1TDHXthr@ep-frosty-hat-a1j1e31f-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

console.log('Attempting direct connection to:', databaseUrl);

// Create Sequelize instance
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  }
});

interface TableResult {
  table_name: string;
}

// Test connection
async function testConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
    
    // List tables
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      LIMIT 5;
    `);
    
    console.log('Tables in database (limited to 5):');
    (tables as TableResult[]).forEach(t => console.log(`- ${t.table_name}`));
    
    console.log('\nConnection test complete.');
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Unable to connect to the database:', error);
    }
  } finally {
    await sequelize.close();
  }
}

testConnection(); 