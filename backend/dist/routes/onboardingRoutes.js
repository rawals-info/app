"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const onboardingController_1 = __importDefault(require("../controllers/onboardingController"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
// Get onboarding status
router.get('/status', onboardingController_1.default.getOnboardingStatus);
// Update onboarding progress
router.put('/progress', onboardingController_1.default.updateOnboardingProgress);
// Complete onboarding
router.post('/complete', onboardingController_1.default.completeOnboarding);
exports.default = router;
