import express from 'express';
import * as foodLogController from '../controllers/foodLogController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// CRUD operations
router.post('/', foodLogController.createFoodLog);
router.get('/', foodLogController.getFoodLogs);
router.get('/statistics', foodLogController.getFoodStatistics);
router.get('/:id', foodLogController.getFoodLogById);
router.put('/:id', foodLogController.updateFoodLog);
router.delete('/:id', foodLogController.deleteFoodLog);

export default router; 