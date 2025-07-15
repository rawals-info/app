import express from 'express';
import * as bloodSugarController from '../controllers/bloodSugarController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// CRUD operations
router.post('/', bloodSugarController.createReading);
router.get('/', bloodSugarController.getReadings);
router.get('/statistics', bloodSugarController.getStatistics);
router.get('/:id', bloodSugarController.getReadingById);
router.put('/:id', bloodSugarController.updateReading);
router.delete('/:id', bloodSugarController.deleteReading);

export default router; 