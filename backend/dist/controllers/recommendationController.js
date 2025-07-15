"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecommendation = exports.createRecommendation = exports.markAllAsRead = exports.recordAction = exports.dismissRecommendation = exports.markAsRead = exports.getRecommendationById = exports.getRecommendations = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
// Get all recommendations for a user with optional filters
const getRecommendations = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const { type, priority, isRead, isDismissed, startDate, endDate, limit = '50', offset = '0' } = req.query;
        // Build filter conditions
        const whereConditions = { userId };
        // Add type filter if provided
        if (type) {
            whereConditions.type = type;
        }
        // Add priority filter if provided
        if (priority) {
            whereConditions.priority = priority;
        }
        // Add read status filter if provided
        if (isRead !== undefined) {
            whereConditions.isRead = isRead === 'true';
        }
        // Add dismissed status filter if provided
        if (isDismissed !== undefined) {
            whereConditions.isDismissed = isDismissed === 'true';
        }
        // Add date range filter if provided
        if (startDate && endDate) {
            whereConditions.triggerDateTime = {
                [sequelize_1.Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }
        else if (startDate) {
            whereConditions.triggerDateTime = {
                [sequelize_1.Op.gte]: new Date(startDate)
            };
        }
        else if (endDate) {
            whereConditions.triggerDateTime = {
                [sequelize_1.Op.lte]: new Date(endDate)
            };
        }
        // Get recommendations with pagination
        const recommendations = await models_1.Recommendation.findAndCountAll({
            where: whereConditions,
            order: [
                ['priority', 'DESC'],
                ['triggerDateTime', 'DESC']
            ],
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10)
        });
        return res.json({
            success: true,
            data: {
                total: recommendations.count,
                recommendations: recommendations.rows
            }
        });
    }
    catch (error) {
        console.error('Get recommendations error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve recommendations',
            error: error.message
        });
    }
};
exports.getRecommendations = getRecommendations;
// Get a specific recommendation by ID
const getRecommendationById = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const { id } = req.params;
        // Find recommendation
        const recommendation = await models_1.Recommendation.findOne({
            where: { id, userId }
        });
        if (!recommendation) {
            return res.status(404).json({
                success: false,
                message: 'Recommendation not found'
            });
        }
        return res.json({
            success: true,
            data: recommendation
        });
    }
    catch (error) {
        console.error('Get recommendation by ID error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve recommendation',
            error: error.message
        });
    }
};
exports.getRecommendationById = getRecommendationById;
// Mark recommendation as read
const markAsRead = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const { id } = req.params;
        // Find recommendation
        const recommendation = await models_1.Recommendation.findOne({
            where: { id, userId }
        });
        if (!recommendation) {
            return res.status(404).json({
                success: false,
                message: 'Recommendation not found'
            });
        }
        // Update read status
        await recommendation.update({ isRead: true });
        return res.json({
            success: true,
            message: 'Recommendation marked as read',
            data: recommendation
        });
    }
    catch (error) {
        console.error('Mark as read error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to mark recommendation as read',
            error: error.message
        });
    }
};
exports.markAsRead = markAsRead;
// Mark recommendation as dismissed
const dismissRecommendation = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const { id } = req.params;
        // Find recommendation
        const recommendation = await models_1.Recommendation.findOne({
            where: { id, userId }
        });
        if (!recommendation) {
            return res.status(404).json({
                success: false,
                message: 'Recommendation not found'
            });
        }
        // Update dismissed status
        await recommendation.update({ isDismissed: true });
        return res.json({
            success: true,
            message: 'Recommendation dismissed',
            data: recommendation
        });
    }
    catch (error) {
        console.error('Dismiss recommendation error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to dismiss recommendation',
            error: error.message
        });
    }
};
exports.dismissRecommendation = dismissRecommendation;
// Record action taken on recommendation
const recordAction = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const { id } = req.params;
        const { actionDetails } = req.body;
        // Find recommendation
        const recommendation = await models_1.Recommendation.findOne({
            where: { id, userId }
        });
        if (!recommendation) {
            return res.status(404).json({
                success: false,
                message: 'Recommendation not found'
            });
        }
        // Update action status and details
        await recommendation.update({
            actionTaken: true,
            actionDetails: actionDetails || {},
            isRead: true
        });
        return res.json({
            success: true,
            message: 'Action recorded for recommendation',
            data: recommendation
        });
    }
    catch (error) {
        console.error('Record action error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to record action for recommendation',
            error: error.message
        });
    }
};
exports.recordAction = recordAction;
// Mark all recommendations as read
const markAllAsRead = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const { type } = req.query;
        // Build filter conditions
        const whereConditions = {
            userId,
            isRead: false
        };
        // Add type filter if provided
        if (type) {
            whereConditions.type = type;
        }
        // Update all matching recommendations
        const [updatedCount] = await models_1.Recommendation.update({ isRead: true }, { where: whereConditions });
        return res.json({
            success: true,
            message: 'Recommendations marked as read',
            data: { count: updatedCount }
        });
    }
    catch (error) {
        console.error('Mark all as read error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to mark recommendations as read',
            error: error.message
        });
    }
};
exports.markAllAsRead = markAllAsRead;
// Create a new recommendation (usually triggered by system events, but useful for testing)
const createRecommendation = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const { type, priority, title, description, suggestedAction, triggerType, triggerValue } = req.body;
        // Create recommendation
        const recommendation = await models_1.Recommendation.create({
            userId,
            type,
            priority: priority || 'medium',
            title,
            description,
            suggestedAction,
            triggerType,
            triggerValue: triggerValue || {},
            triggerDateTime: new Date(),
            isRead: false,
            isDismissed: false,
            actionTaken: false
        });
        return res.status(201).json({
            success: true,
            message: 'Recommendation created successfully',
            data: recommendation
        });
    }
    catch (error) {
        console.error('Create recommendation error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create recommendation',
            error: error.message
        });
    }
};
exports.createRecommendation = createRecommendation;
// Delete a recommendation (mainly for admin/testing purposes)
const deleteRecommendation = async (req, res) => {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const { id } = req.params;
        // Check user role
        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
            // Only allow users to delete their own recommendations
            const recommendation = await models_1.Recommendation.findOne({
                where: { id, userId }
            });
            if (!recommendation) {
                return res.status(404).json({
                    success: false,
                    message: 'Recommendation not found'
                });
            }
            await recommendation.destroy();
        }
        else {
            // Admins can delete any recommendation
            const recommendation = await models_1.Recommendation.findByPk(id);
            if (!recommendation) {
                return res.status(404).json({
                    success: false,
                    message: 'Recommendation not found'
                });
            }
            await recommendation.destroy();
        }
        return res.json({
            success: true,
            message: 'Recommendation deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete recommendation error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete recommendation',
            error: error.message
        });
    }
};
exports.deleteRecommendation = deleteRecommendation;
exports.default = {
    getRecommendations: exports.getRecommendations,
    getRecommendationById: exports.getRecommendationById,
    markAsRead: exports.markAsRead,
    dismissRecommendation: exports.dismissRecommendation,
    recordAction: exports.recordAction,
    markAllAsRead: exports.markAllAsRead,
    createRecommendation: exports.createRecommendation,
    deleteRecommendation: exports.deleteRecommendation
};
