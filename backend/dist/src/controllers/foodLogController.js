"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFoodStatistics = exports.deleteFoodLog = exports.updateFoodLog = exports.getFoodLogById = exports.getFoodLogs = exports.createFoodLog = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
// Create a new food log entry
const createFoodLog = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const { mealType, consumptionTime, foodItems, totalCalories, totalCarbs, totalProtein, totalFat, totalSugar, imageUrls, notes } = req.body;
        // Create new food log entry
        const foodLog = await models_1.FoodLog.create({
            userId,
            mealType,
            consumptionTime: consumptionTime || new Date(),
            foodItems: foodItems || [],
            totalCalories,
            totalCarbs,
            totalProtein,
            totalFat,
            totalSugar,
            imageUrls: imageUrls || [],
            notes
        });
        // If food items are provided, analyze them
        if (foodItems && foodItems.length > 0) {
            // In a real implementation, this would call an AI service
            const aiAnalysis = await analyzeFoodItems(foodItems);
            // Update the food log with AI analysis results
            await foodLog.update({
                aiAnalysis
            });
            // Create recommendations based on AI analysis
            if (aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0) {
                for (const rec of aiAnalysis.recommendations) {
                    await models_1.Recommendation.create({
                        userId,
                        type: 'food',
                        priority: rec.priority || 'medium',
                        title: rec.title,
                        description: rec.description,
                        suggestedAction: rec.suggestedAction,
                        triggerType: 'food_analysis',
                        triggerValue: { foodLogId: foodLog.id, concern: rec.concern },
                        triggerDateTime: new Date()
                    });
                }
            }
        }
        return res.status(201).json({
            success: true,
            message: 'Food log entry created successfully',
            data: foodLog
        });
    }
    catch (error) {
        console.error('Create food log error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create food log entry',
            error: error.message
        });
    }
};
exports.createFoodLog = createFoodLog;
// Get all food log entries for a user with optional filters
const getFoodLogs = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const { startDate, endDate, mealType, limit = '50', offset = '0' } = req.query;
        // Build filter conditions
        const whereConditions = { userId };
        // Add date range filter if provided
        if (startDate && endDate) {
            whereConditions.consumptionTime = {
                [sequelize_1.Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }
        else if (startDate) {
            whereConditions.consumptionTime = {
                [sequelize_1.Op.gte]: new Date(startDate)
            };
        }
        else if (endDate) {
            whereConditions.consumptionTime = {
                [sequelize_1.Op.lte]: new Date(endDate)
            };
        }
        // Add meal type filter if provided
        if (mealType) {
            whereConditions.mealType = mealType;
        }
        // Get food logs with pagination
        const foodLogs = await models_1.FoodLog.findAndCountAll({
            where: whereConditions,
            order: [['consumptionTime', 'DESC']],
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10)
        });
        return res.json({
            success: true,
            data: {
                total: foodLogs.count,
                foodLogs: foodLogs.rows
            }
        });
    }
    catch (error) {
        console.error('Get food logs error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve food logs',
            error: error.message
        });
    }
};
exports.getFoodLogs = getFoodLogs;
// Get a specific food log entry by ID
const getFoodLogById = async (req, res) => {
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
        // Find food log
        const foodLog = await models_1.FoodLog.findOne({
            where: { id, userId }
        });
        if (!foodLog) {
            return res.status(404).json({
                success: false,
                message: 'Food log entry not found'
            });
        }
        return res.json({
            success: true,
            data: foodLog
        });
    }
    catch (error) {
        console.error('Get food log by ID error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve food log entry',
            error: error.message
        });
    }
};
exports.getFoodLogById = getFoodLogById;
// Update a food log entry
const updateFoodLog = async (req, res) => {
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
        const { mealType, consumptionTime, foodItems, totalCalories, totalCarbs, totalProtein, totalFat, totalSugar, imageUrls, notes } = req.body;
        // Find food log
        const foodLog = await models_1.FoodLog.findOne({
            where: { id, userId }
        });
        if (!foodLog) {
            return res.status(404).json({
                success: false,
                message: 'Food log entry not found'
            });
        }
        // Update food log
        const updateData = {
            mealType: mealType || foodLog.mealType,
            consumptionTime: consumptionTime || foodLog.consumptionTime,
            totalCalories: totalCalories !== undefined ? totalCalories : foodLog.totalCalories,
            totalCarbs: totalCarbs !== undefined ? totalCarbs : foodLog.totalCarbs,
            totalProtein: totalProtein !== undefined ? totalProtein : foodLog.totalProtein,
            totalFat: totalFat !== undefined ? totalFat : foodLog.totalFat,
            totalSugar: totalSugar !== undefined ? totalSugar : foodLog.totalSugar,
            notes: notes || foodLog.notes
        };
        // Update food items if provided
        if (foodItems) {
            updateData.foodItems = foodItems;
            // Re-analyze food items
            const aiAnalysis = await analyzeFoodItems(foodItems);
            updateData.aiAnalysis = aiAnalysis;
        }
        // Update image URLs if provided
        if (imageUrls) {
            updateData.imageUrls = imageUrls;
        }
        await foodLog.update(updateData);
        return res.json({
            success: true,
            message: 'Food log entry updated successfully',
            data: foodLog
        });
    }
    catch (error) {
        console.error('Update food log error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update food log entry',
            error: error.message
        });
    }
};
exports.updateFoodLog = updateFoodLog;
// Delete a food log entry
const deleteFoodLog = async (req, res) => {
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
        // Find food log
        const foodLog = await models_1.FoodLog.findOne({
            where: { id, userId }
        });
        if (!foodLog) {
            return res.status(404).json({
                success: false,
                message: 'Food log entry not found'
            });
        }
        // Delete food log
        await foodLog.destroy();
        return res.json({
            success: true,
            message: 'Food log entry deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete food log error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete food log entry',
            error: error.message
        });
    }
};
exports.deleteFoodLog = deleteFoodLog;
// Get food statistics for a time period
const getFoodStatistics = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const { startDate, endDate } = req.query;
        // Validate date parameters
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date and end date are required'
            });
        }
        // Create date range filter
        const dateRange = {
            [sequelize_1.Op.between]: [new Date(startDate), new Date(endDate)]
        };
        // Get all food logs in the date range
        const foodLogs = await models_1.FoodLog.findAll({
            where: {
                userId,
                consumptionTime: dateRange
            },
            attributes: [
                'mealType',
                'totalCalories',
                'totalCarbs',
                'totalProtein',
                'totalFat',
                'totalSugar',
                'consumptionTime'
            ]
        });
        // Calculate statistics
        let totalCalories = 0;
        let totalCarbs = 0;
        let totalProtein = 0;
        let totalFat = 0;
        let totalSugar = 0;
        const mealCounts = {
            breakfast: 0,
            lunch: 0,
            dinner: 0,
            snack: 0
        };
        const dailyCalories = {};
        foodLogs.forEach((log) => {
            // Add to totals
            totalCalories += log.totalCalories || 0;
            totalCarbs += log.totalCarbs || 0;
            totalProtein += log.totalProtein || 0;
            totalFat += log.totalFat || 0;
            totalSugar += log.totalSugar || 0;
            // Count meal types
            if (log.mealType) {
                mealCounts[log.mealType] = (mealCounts[log.mealType] || 0) + 1;
            }
            // Track daily calories
            const dateStr = new Date(log.consumptionTime).toISOString().split('T')[0];
            dailyCalories[dateStr] = (dailyCalories[dateStr] || 0) + (log.totalCalories || 0);
        });
        // Calculate averages
        const numDays = Object.keys(dailyCalories).length || 1;
        const avgCaloriesPerDay = totalCalories / numDays;
        return res.json({
            success: true,
            data: {
                totalEntries: foodLogs.length,
                totalsByNutrient: {
                    calories: totalCalories,
                    carbs: totalCarbs,
                    protein: totalProtein,
                    fat: totalFat,
                    sugar: totalSugar
                },
                averagesByNutrient: {
                    caloriesPerDay: avgCaloriesPerDay,
                    carbsPerDay: totalCarbs / numDays,
                    proteinPerDay: totalProtein / numDays,
                    fatPerDay: totalFat / numDays,
                    sugarPerDay: totalSugar / numDays
                },
                mealTypeCounts: mealCounts,
                dailyCalories: dailyCalories
            }
        });
    }
    catch (error) {
        console.error('Get food statistics error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve food statistics',
            error: error.message
        });
    }
};
exports.getFoodStatistics = getFoodStatistics;
// Helper function to analyze food items
const analyzeFoodItems = async (foodItems) => {
    // In a real implementation, this would call an AI service or nutritional database
    // For now, we'll return a placeholder analysis
    // Calculate totals from food items
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalSugar = 0;
    const foodConcerns = [];
    const foodBenefits = [];
    // Process each food item
    foodItems.forEach(item => {
        // Add to totals
        totalCalories += item.calories || 0;
        totalCarbs += item.carbs || 0;
        totalProtein += item.protein || 0;
        totalFat += item.fat || 0;
        totalSugar += item.sugar || 0;
        // Check for high sugar items
        if ((item.sugar || 0) > 15) {
            foodConcerns.push(`High sugar content in ${item.name}`);
        }
        // Check for high fat items
        if ((item.fat || 0) > 20) {
            foodConcerns.push(`High fat content in ${item.name}`);
        }
        // Check for protein-rich items
        if ((item.protein || 0) > 15) {
            foodBenefits.push(`Good protein source from ${item.name}`);
        }
    });
    // Generate recommendations based on analysis
    const recommendations = [];
    // If high sugar detected
    if (totalSugar > 50) {
        recommendations.push({
            priority: 'high',
            title: 'Reduce Sugar Intake',
            description: 'Your meal contains more sugar than recommended for a single meal.',
            suggestedAction: 'Try replacing sugary items with fruits or lower-sugar alternatives.',
            concern: 'high_sugar'
        });
    }
    // If low protein detected
    if (totalProtein < 15 && foodItems.length > 1) {
        recommendations.push({
            priority: 'medium',
            title: 'Increase Protein Intake',
            description: 'This meal is low in protein which is important for muscle maintenance and satiety.',
            suggestedAction: 'Try adding lean protein sources like chicken, fish, tofu, or legumes to your meals.',
            concern: 'low_protein'
        });
    }
    return {
        nutritionalSummary: {
            totalCalories,
            totalCarbs,
            totalProtein,
            totalFat,
            totalSugar
        },
        concerns: foodConcerns,
        benefits: foodBenefits,
        recommendations
    };
};
exports.default = {
    createFoodLog: exports.createFoodLog,
    getFoodLogs: exports.getFoodLogs,
    getFoodLogById: exports.getFoodLogById,
    updateFoodLog: exports.updateFoodLog,
    deleteFoodLog: exports.deleteFoodLog,
    getFoodStatistics: exports.getFoodStatistics
};
