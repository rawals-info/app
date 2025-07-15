"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExerciseStatistics = exports.deleteExercise = exports.updateExercise = exports.getExerciseById = exports.getExercises = exports.createExercise = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
// Create a new exercise entry
const createExercise = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const { exerciseType, category, intensity, startTime, endTime, duration, caloriesBurned, distance, steps, heartRateAvg, heartRateMax, bloodSugarBefore, bloodSugarAfter, notes } = req.body;
        // Create new exercise entry
        const exercise = await models_1.Exercise.create({
            userId,
            exerciseType,
            category,
            intensity,
            startTime: startTime || new Date(),
            endTime,
            duration,
            caloriesBurned,
            distance,
            steps,
            heartRateAvg,
            heartRateMax,
            bloodSugarBefore,
            bloodSugarAfter,
            notes
        });
        // Check blood sugar change if both before and after readings are provided
        if (bloodSugarBefore && bloodSugarAfter) {
            await analyzeBloodSugarChange(userId, exercise);
        }
        return res.status(201).json({
            success: true,
            message: 'Exercise recorded successfully',
            data: exercise
        });
    }
    catch (error) {
        console.error('Create exercise error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to record exercise',
            error: error.message
        });
    }
};
exports.createExercise = createExercise;
// Get all exercise entries for a user with optional filters
const getExercises = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const { startDate, endDate, exerciseType, category, limit = 50, offset = 0 } = req.query;
        // Build filter conditions
        const whereConditions = { userId };
        // Add date range filter if provided
        if (startDate && endDate) {
            whereConditions.startTime = {
                [sequelize_1.Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }
        else if (startDate) {
            whereConditions.startTime = {
                [sequelize_1.Op.gte]: new Date(startDate)
            };
        }
        else if (endDate) {
            whereConditions.startTime = {
                [sequelize_1.Op.lte]: new Date(endDate)
            };
        }
        // Add exercise type filter if provided
        if (exerciseType) {
            whereConditions.exerciseType = exerciseType;
        }
        // Add category filter if provided
        if (category) {
            whereConditions.category = category;
        }
        // Get exercises with pagination
        const exercises = await models_1.Exercise.findAndCountAll({
            where: whereConditions,
            order: [['startTime', 'DESC']],
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10)
        });
        return res.json({
            success: true,
            data: {
                total: exercises.count,
                exercises: exercises.rows
            }
        });
    }
    catch (error) {
        console.error('Get exercises error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve exercises',
            error: error.message
        });
    }
};
exports.getExercises = getExercises;
// Get a specific exercise by ID
const getExerciseById = async (req, res) => {
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
        // Find exercise
        const exercise = await models_1.Exercise.findOne({
            where: { id, userId }
        });
        if (!exercise) {
            return res.status(404).json({
                success: false,
                message: 'Exercise not found'
            });
        }
        return res.json({
            success: true,
            data: exercise
        });
    }
    catch (error) {
        console.error('Get exercise by ID error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve exercise',
            error: error.message
        });
    }
};
exports.getExerciseById = getExerciseById;
// Update an exercise entry
const updateExercise = async (req, res) => {
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
        const { exerciseType, category, intensity, startTime, endTime, duration, caloriesBurned, distance, steps, heartRateAvg, heartRateMax, bloodSugarBefore, bloodSugarAfter, notes } = req.body;
        // Find exercise
        const exercise = await models_1.Exercise.findOne({
            where: { id, userId }
        });
        if (!exercise) {
            return res.status(404).json({
                success: false,
                message: 'Exercise not found'
            });
        }
        // Update exercise
        await exercise.update({
            exerciseType: exerciseType || exercise.exerciseType,
            category: category || exercise.category,
            intensity: intensity || exercise.intensity,
            startTime: startTime || exercise.startTime,
            endTime: endTime !== undefined ? endTime : exercise.endTime,
            duration: duration !== undefined ? duration : exercise.duration,
            caloriesBurned: caloriesBurned !== undefined ? caloriesBurned : exercise.caloriesBurned,
            distance: distance !== undefined ? distance : exercise.distance,
            steps: steps !== undefined ? steps : exercise.steps,
            heartRateAvg: heartRateAvg !== undefined ? heartRateAvg : exercise.heartRateAvg,
            heartRateMax: heartRateMax !== undefined ? heartRateMax : exercise.heartRateMax,
            bloodSugarBefore: bloodSugarBefore !== undefined ? bloodSugarBefore : exercise.bloodSugarBefore,
            bloodSugarAfter: bloodSugarAfter !== undefined ? bloodSugarAfter : exercise.bloodSugarAfter,
            notes: notes || exercise.notes
        });
        // Check blood sugar change if both before and after readings are updated
        if (bloodSugarBefore !== undefined || bloodSugarAfter !== undefined) {
            if (exercise.bloodSugarBefore && exercise.bloodSugarAfter) {
                await analyzeBloodSugarChange(userId, exercise);
            }
        }
        return res.json({
            success: true,
            message: 'Exercise updated successfully',
            data: exercise
        });
    }
    catch (error) {
        console.error('Update exercise error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update exercise',
            error: error.message
        });
    }
};
exports.updateExercise = updateExercise;
// Delete an exercise entry
const deleteExercise = async (req, res) => {
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
        // Find exercise
        const exercise = await models_1.Exercise.findOne({
            where: { id, userId }
        });
        if (!exercise) {
            return res.status(404).json({
                success: false,
                message: 'Exercise not found'
            });
        }
        // Delete exercise
        await exercise.destroy();
        return res.json({
            success: true,
            message: 'Exercise deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete exercise error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete exercise',
            error: error.message
        });
    }
};
exports.deleteExercise = deleteExercise;
// Get exercise statistics
const getExerciseStatistics = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        const { period = '7days' } = req.query;
        // Calculate date range based on period
        const endDate = new Date();
        let startDate = new Date();
        switch (period) {
            case '24hours':
                startDate.setDate(endDate.getDate() - 1);
                break;
            case '7days':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case '30days':
                startDate.setDate(endDate.getDate() - 30);
                break;
            case '90days':
                startDate.setDate(endDate.getDate() - 90);
                break;
            default:
                startDate.setDate(endDate.getDate() - 7);
        }
        // Get all exercises in the date range
        const exercises = await models_1.Exercise.findAll({
            where: {
                userId,
                startTime: {
                    [sequelize_1.Op.between]: [startDate, endDate]
                }
            },
            order: [['startTime', 'ASC']]
        });
        // Calculate statistics
        let stats = {
            count: exercises.length,
            totalDuration: 0,
            totalCaloriesBurned: 0,
            totalDistance: 0,
            totalSteps: 0,
            byExerciseType: {},
            byCategory: {},
            byDay: {},
            bloodSugarImpact: {
                averageChange: 0,
                readings: 0
            }
        };
        if (exercises.length > 0) {
            // Calculate basic stats
            let totalDuration = 0;
            let totalCaloriesBurned = 0;
            let totalDistance = 0;
            let totalSteps = 0;
            let bloodSugarReadings = 0;
            let totalBloodSugarChange = 0;
            // Group by exercise type
            let byType = {};
            // Group by category
            let byCategory = {};
            // Group by day
            let byDay = {};
            exercises.forEach(exercise => {
                // Update basic stats
                if (exercise.duration)
                    totalDuration += exercise.duration;
                if (exercise.caloriesBurned)
                    totalCaloriesBurned += exercise.caloriesBurned;
                if (exercise.distance)
                    totalDistance += exercise.distance;
                if (exercise.steps)
                    totalSteps += exercise.steps;
                // Check blood sugar impact
                if (exercise.bloodSugarBefore && exercise.bloodSugarAfter) {
                    const change = exercise.bloodSugarAfter - exercise.bloodSugarBefore;
                    totalBloodSugarChange += change;
                    bloodSugarReadings++;
                }
                // Group by exercise type
                const type = exercise.exerciseType;
                if (!byType[type]) {
                    byType[type] = {
                        count: 0,
                        totalDuration: 0,
                        totalCaloriesBurned: 0
                    };
                }
                byType[type].count++;
                if (exercise.duration)
                    byType[type].totalDuration += exercise.duration;
                if (exercise.caloriesBurned)
                    byType[type].totalCaloriesBurned += exercise.caloriesBurned;
                // Group by category
                const category = exercise.category;
                if (!byCategory[category]) {
                    byCategory[category] = {
                        count: 0,
                        totalDuration: 0,
                        totalCaloriesBurned: 0
                    };
                }
                byCategory[category].count++;
                if (exercise.duration)
                    byCategory[category].totalDuration += exercise.duration;
                if (exercise.caloriesBurned)
                    byCategory[category].totalCaloriesBurned += exercise.caloriesBurned;
                // Group by day
                const day = exercise.startTime.toISOString().split('T')[0];
                if (!byDay[day]) {
                    byDay[day] = {
                        count: 0,
                        totalDuration: 0,
                        totalCaloriesBurned: 0
                    };
                }
                byDay[day].count++;
                if (exercise.duration)
                    byDay[day].totalDuration += exercise.duration;
                if (exercise.caloriesBurned)
                    byDay[day].totalCaloriesBurned += exercise.caloriesBurned;
            });
            // Update stats object
            stats.totalDuration = totalDuration;
            stats.totalCaloriesBurned = totalCaloriesBurned;
            stats.totalDistance = totalDistance;
            stats.totalSteps = totalSteps;
            stats.byExerciseType = byType;
            stats.byCategory = byCategory;
            stats.byDay = byDay;
            if (bloodSugarReadings > 0) {
                stats.bloodSugarImpact = {
                    averageChange: totalBloodSugarChange / bloodSugarReadings,
                    readings: bloodSugarReadings
                };
            }
        }
        return res.json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        console.error('Get exercise statistics error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve exercise statistics',
            error: error.message
        });
    }
};
exports.getExerciseStatistics = getExerciseStatistics;
// Helper function to analyze blood sugar changes from exercise
const analyzeBloodSugarChange = async (userId, exercise) => {
    try {
        const before = exercise.bloodSugarBefore;
        const after = exercise.bloodSugarAfter;
        const change = after - before;
        const exerciseType = exercise.exerciseType;
        // Create recommendation based on blood sugar change
        if (change < -30) {
            // Significant drop in blood sugar
            await models_1.Recommendation.create({
                userId,
                type: 'exercise',
                priority: 'medium',
                title: 'Significant Blood Sugar Drop After Exercise',
                description: `Your blood sugar dropped by ${Math.abs(change)} points after your ${exerciseType} session.`,
                suggestedAction: 'Consider having a small snack before similar exercise in the future to prevent low blood sugar.',
                triggerType: 'exercise_reminder',
                triggerValue: {
                    exerciseId: exercise.id,
                    before,
                    after,
                    change
                },
                triggerDateTime: new Date()
            });
        }
        else if (change > 30) {
            // Significant increase in blood sugar
            await models_1.Recommendation.create({
                userId,
                type: 'exercise',
                priority: 'low',
                title: 'Blood Sugar Increased After Exercise',
                description: `Your blood sugar increased by ${change} points after your ${exerciseType} session.`,
                suggestedAction: 'This can happen with high-intensity exercise. Consider moderate-intensity exercise if managing blood sugar is a priority.',
                triggerType: 'exercise_reminder',
                triggerValue: {
                    exerciseId: exercise.id,
                    before,
                    after,
                    change
                },
                triggerDateTime: new Date()
            });
        }
        else if (change < 0 && change >= -30) {
            // Moderate drop - positive outcome
            await models_1.Recommendation.create({
                userId,
                type: 'exercise',
                priority: 'low',
                title: 'Positive Exercise Impact on Blood Sugar',
                description: `Your ${exerciseType} session helped lower your blood sugar by ${Math.abs(change)} points.`,
                suggestedAction: 'This type of exercise seems effective for you. Consider making it a regular part of your routine.',
                triggerType: 'exercise_reminder',
                triggerValue: {
                    exerciseId: exercise.id,
                    before,
                    after,
                    change
                },
                triggerDateTime: new Date()
            });
        }
    }
    catch (error) {
        console.error('Error analyzing blood sugar change:', error);
    }
};
