"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Import env variables from project root
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
// Sequelize configuration - must be compatible with CommonJS require
const config = {
    development: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // For Neon Postgres, we typically need this
            }
        },
        define: {
            timestamps: true,
            underscored: true
        }
    },
    test: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        define: {
            timestamps: true,
            underscored: true
        }
    },
    production: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        define: {
            timestamps: true,
            underscored: true
        }
    }
};
// Export in a way compatible with both ES modules and CommonJS
module.exports = config;
exports.default = config;
