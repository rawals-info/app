"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdminRole = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
// Admin Authentication middleware
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
        // Verify token using admin JWT secret
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ADMIN_JWT_SECRET || 'admin_jwt_secret');
        // Check if admin exists
        const admin = await models_1.AdminAuth.findByPk(decoded.id);
        if (!admin || admin.isLocked) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed. Admin not found or account locked.'
            });
        }
        // Add admin to request object
        req.admin = {
            id: admin.id,
            email: admin.email,
            role: admin.role
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
 * Middleware to check if admin has required role
 */
const checkAdminRole = (roles) => {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }
        next();
    };
};
exports.checkAdminRole = checkAdminRole;
exports.default = {
    authenticate: exports.authenticate,
    checkAdminRole: exports.checkAdminRole
};
