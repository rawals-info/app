#!/usr/bin/env node

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Sequelize, DataTypes } from 'sequelize';
import sequelizeConfig from '../src/config/sequelize-cli';

dotenv.config();

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

/**
 * Log with color
 */
function logColored(message: string, color: string): void {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Apply migrations directly using the migration files
 */
async function runMigrations(isUndo: boolean = false): Promise<void> {
  const env = process.env.NODE_ENV || 'development';
  const config = sequelizeConfig[env];

  // Create Sequelize instance from config
  let sequelize: Sequelize;
  if (config.use_env_variable && process.env[config.use_env_variable]) {
    sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
  } else {
    sequelize = new Sequelize(config.database!, config.username!, config.password!, config);
  }

  // Ensure SequelizeMeta table exists
  await sequelize.getQueryInterface().createTable('SequelizeMeta', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  }).catch(() => {/* table might already exist */});

  // Get migration files
  const migrationsPath = path.resolve(__dirname, '../src/migrations');
  const migrationFiles = fs.readdirSync(migrationsPath)
    .filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts'))
    .sort();

  if (migrationFiles.length === 0) {
    logColored('No migration files found.', colors.yellow);
    return;
  }

  try {
    if (isUndo) {
      // Apply only the last migration's down method
      const lastMigration = migrationFiles[migrationFiles.length - 1];
      const migrationModule = await import(path.join(migrationsPath, lastMigration));
      
      logColored(`Reverting migration: ${lastMigration}`, colors.cyan);
      await migrationModule.down(sequelize.getQueryInterface());
      logColored(`✅ Successfully reverted migration: ${lastMigration}`, colors.green);
    } else {
      // Apply all migrations' up methods
      // Fetch already applied migrations
      const appliedRows = await sequelize.query("SELECT name FROM \"SequelizeMeta\"", { type: (sequelize as any).QueryTypes.SELECT }) as any[];
      const appliedSet = new Set(appliedRows.map(r => r.name));

      for (const migrationFile of migrationFiles) {
        if (appliedSet.has(migrationFile)) {
          logColored(`Skipping already applied migration: ${migrationFile}`, colors.yellow);
          continue;
        }
        const migrationModule = await import(path.join(migrationsPath, migrationFile));
        
        try {
          logColored(`Applying migration: ${migrationFile}`, colors.cyan);
          await migrationModule.up(sequelize.getQueryInterface());
          // Record in SequelizeMeta if not already
          await sequelize.query("INSERT INTO \"SequelizeMeta\" (name) VALUES (:name) ON CONFLICT DO NOTHING", { replacements: { name: migrationFile } });
          logColored(`✅ Successfully applied migration: ${migrationFile}`, colors.green);
        } catch (error: any) {
          if (error.name === 'SequelizeUniqueConstraintError' || 
              (error.original && error.original.code === '23505')) {
            logColored(`Migration ${migrationFile} appears to be already applied, skipping.`, colors.yellow);
          } else {
            throw error;
          }
        }
      }
    }
  } finally {
    await sequelize.close();
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  try {
    const args = process.argv.slice(2);
    const isUndo = args.includes('--undo');
    const isSeed = args.includes('--seed');
    const isReset = args.includes('--reset');

    logColored('=== DiabetesBuddy Database Migration Tool ===', colors.bright + colors.green);
    
    if (isReset) {
      logColored('⚠️  RESETTING DATABASE - This will drop all tables and recreate them!', colors.bright + colors.yellow);
      const confirm = args.includes('--force') ? 'yes' : 'no';
      
      if (confirm !== 'yes') {
        logColored('Operation canceled. Use --force to confirm database reset.', colors.yellow);
        process.exit(0);
      }
      
      // Run all migrations' down method in reverse order
      logColored('Running down migrations to reset database...', colors.cyan);
      const migrationsPath = path.resolve(__dirname, '../src/migrations');
      const migrationFiles = fs.readdirSync(migrationsPath)
        .filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts'))
        .sort()
        .reverse();
      
      // Get environment config
      const env = process.env.NODE_ENV || 'development';
      const config = sequelizeConfig[env];
      
      // Create Sequelize instance
      let sequelize: Sequelize;
      if (config.use_env_variable && process.env[config.use_env_variable]) {
        sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
      } else {
        sequelize = new Sequelize(config.database!, config.username!, config.password!, config);
      }
      
      try {
        for (const migrationFile of migrationFiles) {
          try {
            const migrationModule = await import(path.join(migrationsPath, migrationFile));
            logColored(`Reverting migration: ${migrationFile}`, colors.cyan);
            await migrationModule.down(sequelize.getQueryInterface());
          } catch (error) {
            logColored(`Warning: Could not revert migration ${migrationFile}. Continuing...`, colors.yellow);
          }
        }
      } finally {
        await sequelize.close();
      }
      
      // Now apply all migrations again
      await runMigrations();
      
      if (isSeed) {
        logColored('Seeding data not implemented yet.', colors.yellow);
      }
      
      logColored('✅ Database reset completed successfully!', colors.green);
    } else if (isUndo) {
      // Undo the last migration
      await runMigrations(true);
      logColored('✅ Last migration undone successfully!', colors.green);
    } else if (isSeed) {
      // Run seeders
      logColored('Seeding data not implemented yet.', colors.yellow);
    } else {
      // Run migrations
      await runMigrations();
      logColored('✅ Migrations applied successfully!', colors.green);
    }
    
  } catch (error) {
    logColored('Migration failed:', colors.red);
    if (error instanceof Error) {
      logColored(error.message, colors.red);
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run the main function
main(); 