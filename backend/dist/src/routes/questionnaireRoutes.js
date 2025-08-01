"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionnaireController_1 = __importDefault(require("../controllers/questionnaireController"));
const recommendationController_1 = __importDefault(require("../controllers/recommendationController"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public fetch questions
router.get('/questions', questionnaireController_1.default.getQuestions);
// Protected submit answers
router.post('/answers', auth_1.authenticate, questionnaireController_1.default.submitAnswers);
router.post('/summary', recommendationController_1.default.getSummary);
exports.default = router;
