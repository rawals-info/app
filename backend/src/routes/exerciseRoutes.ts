import express from 'express';
import * as exerciseController from '../controllers/exerciseController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// CRUD operations
router.post('/', exerciseController.createExercise);
router.get('/', exerciseController.getExercises);
router.get('/statistics', exerciseController.getExerciseStatistics);
router.get('/:id', exerciseController.getExerciseById);
router.put('/:id', exerciseController.updateExercise);
router.delete('/:id', exerciseController.deleteExercise);

export default router; 