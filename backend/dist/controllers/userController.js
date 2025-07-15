"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
// Register a new user
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, dateOfBirth, gender, weight, height, diabetesType, diagnosisDate } = req.body;
        // Check if user already exists
        const existingUser = await models_1.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        // Create new user
        const user = await models_1.User.create({
            firstName,
            lastName,
            email,
            password,
            dateOfBirth,
            gender,
            weight,
            height,
            diabetesType,
            diagnosisDate,
            targetBloodSugarMin: 70, // Default values, can be updated by user
            targetBloodSugarMax: 180
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'default_jwt_secret', { expiresIn: '7d' });
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                token,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to register user',
            error: error.message
        });
    }
};
exports.register = register;
// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await models_1.User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        // Check if password is correct
        const isPasswordValid = await user.checkPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is inactive. Please contact support.'
            });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'default_jwt_secret', { expiresIn: '7d' });
        return res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to login',
            error: error.message
        });
    }
};
exports.login = login;
// Get user profile
const getProfile = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        // Find user
        const user = await models_1.User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        return res.json({
            success: true,
            data: user
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get user profile',
            error: error.message
        });
    }
};
exports.getProfile = getProfile;
// Update user profile
const updateProfile = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const { firstName, lastName, dateOfBirth, gender, weight, height, diabetesType, diagnosisDate, targetBloodSugarMin, targetBloodSugarMax } = req.body;
        // Find user
        const user = await models_1.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Update user data
        await user.update({
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            dateOfBirth: dateOfBirth || user.dateOfBirth,
            gender: gender || user.gender,
            weight: weight || user.weight,
            height: height || user.height,
            diabetesType: diabetesType || user.diabetesType,
            diagnosisDate: diagnosisDate || user.diagnosisDate,
            targetBloodSugarMin: targetBloodSugarMin || user.targetBloodSugarMin,
            targetBloodSugarMax: targetBloodSugarMax || user.targetBloodSugarMax
        });
        return res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                weight: user.weight,
                height: user.height,
                diabetesType: user.diabetesType,
                diagnosisDate: user.diagnosisDate,
                targetBloodSugarMin: user.targetBloodSugarMin,
                targetBloodSugarMax: user.targetBloodSugarMax
            }
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update user profile',
            error: error.message
        });
    }
};
exports.updateProfile = updateProfile;
// Change password
const changePassword = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const { currentPassword, newPassword } = req.body;
        // Find user
        const user = await models_1.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Verify current password
        const isPasswordValid = await user.checkPassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        // Update password
        user.password = newPassword;
        await user.save();
        return res.json({
            success: true,
            message: 'Password changed successfully'
        });
    }
    catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to change password',
            error: error.message
        });
    }
};
exports.changePassword = changePassword;
