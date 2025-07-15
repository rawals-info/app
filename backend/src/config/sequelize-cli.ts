import dotenv from 'dotenv';
import { Dialect } from 'sequelize';
import path from 'path';

// Import env variables from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Define config interface
interface DatabaseConfig {
  [key: string]: {
    use_env_variable?: string;
    dialect: Dialect;
    dialectOptions?: any;
    define?: any;
    host?: string;
    username?: string;
    password?: string;
    database?: string;
    port?: number;
  }
}

// Sequelize configuration - must be compatible with CommonJS require
const config: DatabaseConfig = {
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
export default config; 