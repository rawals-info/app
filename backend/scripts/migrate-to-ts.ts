import fs from 'fs/promises';
import path from 'path';

const migrationsDir = path.join(process.cwd(), 'src', 'migrations');

async function convertMigrationFiles(): Promise<void> {
  try {
    // Get all JS migration files
    const files = await fs.readdir(migrationsDir);
    const jsFiles = files.filter(file => file.endsWith('.js'));
    
    console.log(`Found ${jsFiles.length} JavaScript migration files to convert`);
    
    for (const file of jsFiles) {
      const filePath = path.join(migrationsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Create TypeScript version with proper imports and exports
      const tsContent = content
        .replace("'use strict';", "")
        .replace("/** @type {import('sequelize-cli').Migration} */", "")
        .replace("module.exports = {", "import { QueryInterface, DataTypes } from 'sequelize';\n\n")
        .replace("  async up(queryInterface, Sequelize) {", "export async function up(queryInterface: QueryInterface): Promise<void> {")
        .replace(/Sequelize\./g, "DataTypes.")
        .replace("  async down(queryInterface, Sequelize) {", "export async function down(queryInterface: QueryInterface): Promise<void> {")
        .replace(/};$/, "");
      
      // Write TypeScript file
      const tsFilePath = filePath.replace('.js', '.ts');
      await fs.writeFile(tsFilePath, tsContent);
      
      console.log(`Converted ${file} to TypeScript`);
    }
    
    console.log('All migration files have been converted to TypeScript');
    
  } catch (error) {
    console.error('Error converting migration files:', error);
    process.exit(1);
  }
}

convertMigrationFiles(); 