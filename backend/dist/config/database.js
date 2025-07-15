"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
exports.createConnection = createConnection;
const sequelize_1 = require("sequelize");
/**
 * Creates and returns a Sequelize instance for database connection
 * @returns Sequelize instance
 */
function createConnection() {
    // Get database URL from environment
    let connectionUrl = process.env.DATABASE_URL;
    if (!connectionUrl) {
        throw new Error('DATABASE_URL environment variable is missing');
    }
    // Clean URL by removing any whitespace or line breaks
    connectionUrl = connectionUrl.replace(/\s+/g, '');
    // Create and return Sequelize instance
    return new sequelize_1.Sequelize(connectionUrl, {
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        define: {
            underscored: true,
            timestamps: true
        }
    });
}
// Create a singleton instance
const sequelize = createConnection();
exports.sequelize = sequelize;
exports.default = sequelize;
