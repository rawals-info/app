"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const migrationsDir = path_1.default.join(process.cwd(), 'src', 'migrations');
async function convertMigrationFiles() {
    try {
        // Get all JS migration files
        const files = await promises_1.default.readdir(migrationsDir);
        const jsFiles = files.filter(file => file.endsWith('.js'));
        console.log(`Found ${jsFiles.length} JavaScript migration files to convert`);
        for (const file of jsFiles) {
            const filePath = path_1.default.join(migrationsDir, file);
            const content = await promises_1.default.readFile(filePath, 'utf-8');
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
            await promises_1.default.writeFile(tsFilePath, tsContent);
            console.log(`Converted ${file} to TypeScript`);
        }
        console.log('All migration files have been converted to TypeScript');
    }
    catch (error) {
        console.error('Error converting migration files:', error);
        process.exit(1);
    }
}
convertMigrationFiles();
