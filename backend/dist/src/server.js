"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// 1. Load .env immediately
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
// 2. Quick ENV debug
console.log('🛠  [DEBUG] NODE_ENV =', process.env.NODE_ENV);
console.log('🛠  [DEBUG] DATABASE_URL =', process.env.DATABASE_URL);
// 3. Now import everything else
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database"); // this will print the DB DEBUG line
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminAuthRoutes_1 = __importDefault(require("./routes/adminAuthRoutes"));
const onboardingRoutes_1 = __importDefault(require("./routes/onboardingRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const bloodSugarRoutes_1 = __importDefault(require("./routes/bloodSugarRoutes"));
const foodLogRoutes_1 = __importDefault(require("./routes/foodLogRoutes"));
const exerciseRoutes_1 = __importDefault(require("./routes/exerciseRoutes"));
const recommendationRoutes_1 = __importDefault(require("./routes/recommendationRoutes"));
const questionnaireRoutes_1 = __importDefault(require("./routes/questionnaireRoutes"));
const hba1cRoutes_1 = __importDefault(require("./routes/hba1cRoutes"));
const mealRoutes_1 = __importDefault(require("./routes/mealRoutes"));
// Initialize express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Simple request logger
app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
// Customer Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/onboarding', onboardingRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/blood-sugar', bloodSugarRoutes_1.default);
app.use('/api/food-logs', foodLogRoutes_1.default);
app.use('/api/exercises', exerciseRoutes_1.default);
app.use('/api/recommendations', recommendationRoutes_1.default);
app.use('/api/questionnaire', questionnaireRoutes_1.default);
app.use('/api/hba1c', hba1cRoutes_1.default);
app.use('/api/meals', mealRoutes_1.default);
// Admin Routes (separate portal)
app.use('/api/admin/auth', adminAuthRoutes_1.default);
// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Error handling middleware
app.use((err, _req, res, _next) => {
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
        await database_1.sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
        // Start express server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
// Start the server
startServer();
