"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const models_1 = require("../models");
const database_1 = require("../config/database");
/**
 * Register a new admin user
 */
const register = async (req, res) => {
    const transaction = await database_1.sequelize.transaction();
    try {
        const { email, password, firstName, lastName, role = 'staff', department, position } = req.body;
        // Check if admin already exists
        const existingAdmin = await models_1.AdminAuth.findOne({ where: { email } });
        if (existingAdmin) {
            await transaction.rollback();
            return res.status(409).json({
                success: false,
                message: 'Admin with this email already exists'
            });
        }
        // Create new admin auth entry
        const adminAuth = await models_1.AdminAuth.create({
            email,
            password,
            role,
            verificationToken: (0, uuid_1.v4)()
        }, { transaction });
        // Create admin profile
        const adminProfile = await models_1.AdminProfile.create({
            authId: adminAuth.id,
            firstName,
            lastName,
            department,
            position
        }, { transaction });
        // Generate JWT token
        const jwtSecret = process.env.ADMIN_JWT_SECRET || 'admin_jwt_secret';
        const payload = { id: adminAuth.id, email: adminAuth.email, role: adminAuth.role };
        const token = jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn: '7d' });
        await transaction.commit();
        return res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            data: {
                token,
                admin: {
                    id: adminProfile.id,
                    firstName: adminProfile.firstName,
                    lastName: adminProfile.lastName,
                    email: adminAuth.email,
                    role: adminAuth.role
                }
            }
        });
    }
    catch (error) {
        await transaction.rollback();
        console.error('Admin registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to register admin',
            error: error.message
        });
    }
};
exports.register = register;
/**
 * Login admin user
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find admin by email
        const adminAuth = await models_1.AdminAuth.findOne({
            where: { email },
            include: [{
                    model: models_1.AdminProfile,
                    as: 'adminProfile'
                }]
        });
        if (!adminAuth) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        // Check if password is correct
        const isPasswordValid = await adminAuth.checkPassword(password);
        if (!isPasswordValid) {
            // Increment login attempts
            await adminAuth.update({
                loginAttempts: adminAuth.loginAttempts + 1,
                isLocked: adminAuth.loginAttempts >= 4 // Lock after 5 failed attempts
            });
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        // Check if account is locked
        if (adminAuth.isLocked) {
            return res.status(403).json({
                success: false,
                message: 'Account is locked. Please contact system administrator.'
            });
        }
        // Update last login time and reset login attempts
        await adminAuth.update({
            lastLogin: new Date(),
            loginAttempts: 0
        });
        // Generate JWT token
        const jwtSecret = process.env.ADMIN_JWT_SECRET || 'admin_jwt_secret';
        const payload = { id: adminAuth.id, email: adminAuth.email, role: adminAuth.role };
        const token = jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn: '7d' });
        const adminProfile = adminAuth.adminProfile;
        if (!adminProfile) {
            return res.status(404).json({
                success: false,
                message: 'Admin profile not found'
            });
        }
        return res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                admin: {
                    id: adminProfile.id,
                    firstName: adminProfile.firstName,
                    lastName: adminProfile.lastName,
                    email: adminAuth.email,
                    role: adminAuth.role,
                    department: adminProfile.department,
                    position: adminProfile.position
                }
            }
        });
    }
    catch (error) {
        console.error('Admin login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to login',
            error: error.message
        });
    }
};
exports.login = login;
/**
 * Get admin profile
 */
const getProfile = async (req, res) => {
    var _a;
    try {
        const adminId = (_a = req.admin) === null || _a === void 0 ? void 0 : _a.id;
        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        // Find admin profile
        const adminAuth = await models_1.AdminAuth.findByPk(adminId, {
            attributes: { exclude: ['password'] },
            include: [{
                    model: models_1.AdminProfile,
                    as: 'adminProfile'
                }]
        });
        if (!adminAuth || !adminAuth.adminProfile) {
            return res.status(404).json({
                success: false,
                message: 'Admin profile not found'
            });
        }
        return res.json({
            success: true,
            data: {
                id: adminAuth.adminProfile.id,
                email: adminAuth.email,
                firstName: adminAuth.adminProfile.firstName,
                lastName: adminAuth.adminProfile.lastName,
                role: adminAuth.role,
                department: adminAuth.adminProfile.department,
                position: adminAuth.adminProfile.position,
                isEmailVerified: adminAuth.isEmailVerified
            }
        });
    }
    catch (error) {
        console.error('Get admin profile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get admin profile',
            error: error.message
        });
    }
};
exports.getProfile = getProfile;
exports.default = {
    register: exports.register,
    login: exports.login,
    getProfile: exports.getProfile
};
