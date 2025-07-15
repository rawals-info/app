import express from 'express';
import adminAuthController from '../controllers/adminAuthController';
import { authenticate } from '../middleware/adminAuth';

const router = express.Router();

// Public routes for admin authentication
router.post('/register', adminAuthController.register);
router.post('/login', adminAuthController.login);

// Protected admin routes
router.get('/profile', authenticate, adminAuthController.getProfile);

export default router; 