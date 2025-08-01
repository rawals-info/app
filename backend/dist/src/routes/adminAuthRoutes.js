"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminAuthController_1 = __importDefault(require("../controllers/adminAuthController"));
const adminAuth_1 = require("../middleware/adminAuth");
const router = express_1.default.Router();
// Public routes for admin authentication
router.post('/register', adminAuthController_1.default.register);
router.post('/login', adminAuthController_1.default.login);
// Protected admin routes
router.get('/profile', adminAuth_1.authenticate, adminAuthController_1.default.getProfile);
exports.default = router;
