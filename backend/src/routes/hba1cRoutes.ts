import express from 'express';
import * as hba1cController from '../controllers/hba1cController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', hba1cController.createReading);
router.get('/', hba1cController.getReadings);
router.get('/:id', hba1cController.getReadingById);
router.put('/:id', hba1cController.updateReading);
router.delete('/:id', hba1cController.deleteReading);

export default router; 