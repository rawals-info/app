#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sequelize_1 = require("sequelize");
const sequelize_cli_1 = __importDefault(require("../src/config/sequelize-cli"));
dotenv_1.default.config();
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
function logColored(message, color) {
    console.log(`${color}${message}${colors.reset}`);
}
/**
 * Apply migrations directly using the migration files
 */
async function runMigrations(isUndo = false) {
    const env = process.env.NODE_ENV || 'development';
    const config = sequelize_cli_1.default[env];
    // Create Sequelize instance from config
    let sequelize;
    if (config.use_env_variable && process.env[config.use_env_variable]) {
        sequelize = new sequelize_1.Sequelize(process.env[config.use_env_variable], config);
    }
    else {
        sequelize = new sequelize_1.Sequelize(config.database, config.username, config.password, config);
    }
    // Get migration files
    const migrationsPath = path_1.default.resolve(__dirname, '../src/migrations');
    const migrationFiles = fs_1.default.readdirSync(migrationsPath)
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
            const migrationModule = await Promise.resolve(`${path_1.default.join(migrationsPath, lastMigration)}`).then(s => __importStar(require(s)));
            logColored(`Reverting migration: ${lastMigration}`, colors.cyan);
            await migrationModule.down(sequelize.getQueryInterface());
            logColored(`✅ Successfully reverted migration: ${lastMigration}`, colors.green);
        }
        else {
            // Apply all migrations' up methods
            for (const migrationFile of migrationFiles) {
                const migrationModule = await Promise.resolve(`${path_1.default.join(migrationsPath, migrationFile)}`).then(s => __importStar(require(s)));
                try {
                    logColored(`Applying migration: ${migrationFile}`, colors.cyan);
                    await migrationModule.up(sequelize.getQueryInterface());
                    logColored(`✅ Successfully applied migration: ${migrationFile}`, colors.green);
                }
                catch (error) {
                    if (error.name === 'SequelizeUniqueConstraintError' ||
                        (error.original && error.original.code === '23505')) {
                        logColored(`Migration ${migrationFile} appears to be already applied, skipping.`, colors.yellow);
                    }
                    else {
                        throw error;
                    }
                }
            }
        }
    }
    finally {
        await sequelize.close();
    }
}
/**
 * Main function
 */
async function main() {
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
            const migrationsPath = path_1.default.resolve(__dirname, '../src/migrations');
            const migrationFiles = fs_1.default.readdirSync(migrationsPath)
                .filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts'))
                .sort()
                .reverse();
            // Get environment config
            const env = process.env.NODE_ENV || 'development';
            const config = sequelize_cli_1.default[env];
            // Create Sequelize instance
            let sequelize;
            if (config.use_env_variable && process.env[config.use_env_variable]) {
                sequelize = new sequelize_1.Sequelize(process.env[config.use_env_variable], config);
            }
            else {
                sequelize = new sequelize_1.Sequelize(config.database, config.username, config.password, config);
            }
            try {
                for (const migrationFile of migrationFiles) {
                    try {
                        const migrationModule = await Promise.resolve(`${path_1.default.join(migrationsPath, migrationFile)}`).then(s => __importStar(require(s)));
                        logColored(`Reverting migration: ${migrationFile}`, colors.cyan);
                        await migrationModule.down(sequelize.getQueryInterface());
                    }
                    catch (error) {
                        logColored(`Warning: Could not revert migration ${migrationFile}. Continuing...`, colors.yellow);
                    }
                }
            }
            finally {
                await sequelize.close();
            }
            // Now apply all migrations again
            await runMigrations();
            if (isSeed) {
                logColored('Seeding data not implemented yet.', colors.yellow);
            }
            logColored('✅ Database reset completed successfully!', colors.green);
        }
        else if (isUndo) {
            // Undo the last migration
            await runMigrations(true);
            logColored('✅ Last migration undone successfully!', colors.green);
        }
        else if (isSeed) {
            // Run seeders
            logColored('Seeding data not implemented yet.', colors.yellow);
        }
        else {
            // Run migrations
            await runMigrations();
            logColored('✅ Migrations applied successfully!', colors.green);
        }
    }
    catch (error) {
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
