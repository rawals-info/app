import express from 'express';
import * as recommendationController from '../controllers/recommendationController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all recommendations with filters
router.get('/', recommendationController.getRecommendations);

// Get a specific recommendation
router.get('/:id', recommendationController.getRecommendationById);

// Mark recommendation as read
router.put('/:id/read', recommendationController.markAsRead);

// Dismiss recommendation
router.put('/:id/dismiss', recommendationController.dismissRecommendation);

// Record action taken on recommendation
router.put('/:id/action', recommendationController.recordAction);

// Mark all recommendations as read
router.put('/read-all', recommendationController.markAllAsRead);

// Create a custom recommendation
router.post('/', recommendationController.createRecommendation);

// Delete a recommendation
router.delete('/:id', recommendationController.deleteRecommendation);

export default router; 