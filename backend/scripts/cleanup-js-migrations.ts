import fs from 'fs/promises';
import path from 'path';

const migrationsDir = path.join(process.cwd(), 'src', 'migrations');

async function cleanupJsMigrations(): Promise<void> {
  try {
    // Get all JS migration files
    const files = await fs.readdir(migrationsDir);
    const jsFiles = files.filter(file => file.endsWith('.js'));
    
    console.log(`Found ${jsFiles.length} JavaScript migration files to delete`);
    
    for (const file of jsFiles) {
      const filePath = path.join(migrationsDir, file);
      await fs.unlink(filePath);
      console.log(`Deleted ${file}`);
    }
    
    console.log('All JavaScript migration files have been deleted');
    
  } catch (error) {
    console.error('Error deleting migration files:', error);
    process.exit(1);
  }
}

cleanupJsMigrations(); 