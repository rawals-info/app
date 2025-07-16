import express from 'express';
import questionnaireController from '../controllers/questionnaireController';
import recommendationController from '../controllers/recommendationController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public fetch questions
router.get('/questions', questionnaireController.getQuestions);

// Protected submit answers
router.post('/answers', authenticate, questionnaireController.submitAnswers);
router.post('/summary', recommendationController.getSummary);

export default router; 