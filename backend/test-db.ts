import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

interface TableResult {
  table_name: string;
}

interface ColumnResult {
  column_name: string;
  data_type: string;
  is_nullable: string;
}

interface MigrationResult {
  name: string;
}

async function testConnection(): Promise<void> {
  const sequelize = new Sequelize(process.env.DATABASE_URL!, {
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
    
    // List all tables
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('Tables in database:');
    for (const table of tables as TableResult[]) {
      console.log(`- ${table.table_name}`);
      
      // Get columns for each table
      const [columns] = await sequelize.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = '${table.table_name}'
        ORDER BY ordinal_position;
      `);
      
      if ((columns as ColumnResult[]).length > 0) {
        console.log('  Columns:');
        (columns as ColumnResult[]).forEach(col => {
          console.log(`    - ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
        });
      }
    }
    
    // Check migrations
    console.log('\nMigrations:');
    try {
      const [migrations] = await sequelize.query(`SELECT * FROM "SequelizeMeta";`);
      (migrations as MigrationResult[]).forEach(migration => {
        console.log(`- ${migration.name}`);
      });
    } catch (error) {
      console.log('No migrations table found');
    }
    
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Unable to connect to the database:', error);
    }
  } finally {
    await sequelize.close();
  }
}

testConnection(); 