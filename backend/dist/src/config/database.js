"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
// src/config/database.ts
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
// 1. Load .env (make sure this path is correct relative to this file)
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
// 2. Grab and normalize DATABASE_URL
let dbUrl = (_a = process.env.DATABASE_URL) === null || _a === void 0 ? void 0 : _a.trim();
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
exports.sequelize = new sequelize_1.Sequelize(dbUrl, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true, // Neon requires SSL
            rejectUnauthorized: false // Neon uses self-signed certs
        }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
        underscored: true,
        timestamps: true
    }
});
exports.default = exports.sequelize;
