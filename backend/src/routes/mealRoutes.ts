import express from 'express';
import * as mealController from '../controllers/mealController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.post('/', mealController.createMeal);
router.get('/', mealController.getMeals);
router.get('/:id', mealController.getMealById);
router.put('/:id', mealController.updateMeal);
router.delete('/:id', mealController.deleteMeal);

export default router; 