// src/server.ts
import path from 'path';
import dotenv from 'dotenv';

// 1. Load .env immediately
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// 2. Quick ENV debug
console.log('🛠  [DEBUG] NODE_ENV =', process.env.NODE_ENV);
console.log('🛠  [DEBUG] DATABASE_URL =', process.env.DATABASE_URL);

// 3. Now import everything else
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { sequelize } from './config/database';  // this will print the DB DEBUG line
import authRoutes from './routes/authRoutes';
import adminAuthRoutes from './routes/adminAuthRoutes';
import onboardingRoutes from './routes/onboardingRoutes';
import userRoutes from './routes/userRoutes';
import bloodSugarRoutes from './routes/bloodSugarRoutes';
import foodLogRoutes from './routes/foodLogRoutes';
import exerciseRoutes from './routes/exerciseRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import questionnaireRoutes from './routes/questionnaireRoutes';
import hba1cRoutes from './routes/hba1cRoutes';
import mealRoutes from './routes/mealRoutes';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Customer Routes
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blood-sugar', bloodSugarRoutes);
app.use('/api/food-logs', foodLogRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/questionnaire', questionnaireRoutes);
app.use('/api/hba1c', hba1cRoutes);
app.use('/api/meals', mealRoutes);

// Admin Routes (separate portal)
app.use('/api/admin/auth', adminAuthRoutes);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Start express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();