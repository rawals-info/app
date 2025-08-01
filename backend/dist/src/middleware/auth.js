"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
// Authentication middleware
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed. No token provided.'
            });
        }
        // Extract token
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed. Invalid token format.'
            });
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');
        // Check if user exists
        const user = await models_1.Auth.findByPk(decoded.id);
        if (!user || user.isLocked) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed. User not found or account locked.'
            });
        }
        // Add user to request object
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication failed. Invalid token.'
                });
            }
            else if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication failed. Token expired.'
                });
            }
        }
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
};
exports.authenticate = authenticate;
/**
 * Middleware to check if user has required role
 */
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }
        next();
    };
};
exports.checkRole = checkRole;
exports.default = {
    authenticate: exports.authenticate,
    checkRole: exports.checkRole
};
