import express from 'express';
import onboardingController, { setGoal } from '../controllers/onboardingController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get onboarding status
router.get('/status', onboardingController.getOnboardingStatus);

// Update onboarding progress
router.put('/progress', onboardingController.updateOnboardingProgress);

// Complete onboarding
router.post('/complete', onboardingController.completeOnboarding);

// Set user goal
router.post('/goal', setGoal);

export default router; 