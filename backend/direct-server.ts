/**
 * Production-ready direct server implementation
 * This script implements a robust database connection and server setup
 */

// Load environment variables
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import { Sequelize } from 'sequelize';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// CORS and body parsing middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Database connection setup
 */
function setupDatabase(): Sequelize {
  // Get and clean DATABASE_URL
  let databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  
  // Remove any whitespace or line breaks from URL
  databaseUrl = databaseUrl.replace(/\s+/g, '');
  
  // Create Sequelize instance
  const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  });
  
  return sequelize;
}

// Setup database connection
let sequelize: Sequelize;
try {
  sequelize = setupDatabase();
  console.log('Database configuration loaded');
} catch (error) {
  if (error instanceof Error) {
    console.error('Failed to configure database:', error.message);
  }
  process.exit(1);
}

// Simple request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database status endpoint
app.get('/db-status', async (req: Request, res: Response) => {
  try {
    await sequelize.authenticate();
    
    // Get basic database info
    const [result] = await sequelize.query(`
      SELECT count(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    
    res.json({
      success: true,
      message: 'Database connection successful',
      details: {
        dialect: 'postgres',
        tableCount: parseInt((result as any)[0].table_count, 10)
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: error.message
      });
    }
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

/**
 * Start server
 */
async function startServer(): Promise<void> {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    // Start express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`Visit http://localhost:${PORT}/health to check server status`);
      console.log(`Visit http://localhost:${PORT}/db-status to check database connection`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Failed to start server:', error);
    }
    process.exit(1);
  }
}

// Start the server
startServer(); 