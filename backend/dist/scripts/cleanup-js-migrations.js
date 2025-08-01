"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const migrationsDir = path_1.default.join(process.cwd(), 'src', 'migrations');
async function cleanupJsMigrations() {
    try {
        // Get all JS migration files
        const files = await promises_1.default.readdir(migrationsDir);
        const jsFiles = files.filter(file => file.endsWith('.js'));
        console.log(`Found ${jsFiles.length} JavaScript migration files to delete`);
        for (const file of jsFiles) {
            const filePath = path_1.default.join(migrationsDir, file);
            await promises_1.default.unlink(filePath);
            console.log(`Deleted ${file}`);
        }
        console.log('All JavaScript migration files have been deleted');
    }
    catch (error) {
        console.error('Error deleting migration files:', error);
        process.exit(1);
    }
}
cleanupJsMigrations();
