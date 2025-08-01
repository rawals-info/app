"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMeal = exports.updateMeal = exports.getMealById = exports.getMeals = exports.createMeal = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const createMeal = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ success: false, message: 'Authentication required' });
        const { consumedAt, description, carbsGrams } = req.body;
        const meal = await models_1.Meal.create({
            userId,
            consumedAt: consumedAt || new Date(),
            description,
            carbsGrams
        });
        return res.status(201).json({ success: true, message: 'Meal logged', data: meal });
    }
    catch (error) {
        console.error('Create meal error:', error);
        return res.status(500).json({ success: false, message: 'Failed to create meal', error: error.message });
    }
};
exports.createMeal = createMeal;
const getMeals = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ success: false, message: 'Authentication required' });
        const { startDate, endDate, limit = '50', offset = '0' } = req.query;
        const where = { userId };
        if (startDate && endDate) {
            where.consumedAt = { [sequelize_1.Op.between]: [new Date(startDate), new Date(endDate)] };
        }
        else if (startDate) {
            where.consumedAt = { [sequelize_1.Op.gte]: new Date(startDate) };
        }
        else if (endDate) {
            where.consumedAt = { [sequelize_1.Op.lte]: new Date(endDate) };
        }
        const result = await models_1.Meal.findAndCountAll({
            where,
            order: [['consumedAt', 'DESC']],
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10)
        });
        return res.json({ success: true, data: { total: result.count, meals: result.rows } });
    }
    catch (error) {
        console.error('Get meals error:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve meals', error: error.message });
    }
};
exports.getMeals = getMeals;
const getMealById = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ success: false, message: 'Authentication required' });
        const { id } = req.params;
        const meal = await models_1.Meal.findOne({ where: { id, userId } });
        if (!meal)
            return res.status(404).json({ success: false, message: 'Meal not found' });
        return res.json({ success: true, data: meal });
    }
    catch (error) {
        console.error('Get meal by ID error:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve meal', error: error.message });
    }
};
exports.getMealById = getMealById;
const updateMeal = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ success: false, message: 'Authentication required' });
        const { id } = req.params;
        const { consumedAt, description, carbsGrams } = req.body;
        const meal = await models_1.Meal.findOne({ where: { id, userId } });
        if (!meal)
            return res.status(404).json({ success: false, message: 'Meal not found' });
        await meal.update({
            consumedAt: consumedAt || meal.consumedAt,
            description: description !== null && description !== void 0 ? description : meal.description,
            carbsGrams: carbsGrams !== null && carbsGrams !== void 0 ? carbsGrams : meal.carbsGrams
        });
        return res.json({ success: true, message: 'Meal updated', data: meal });
    }
    catch (error) {
        console.error('Update meal error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update meal', error: error.message });
    }
};
exports.updateMeal = updateMeal;
const deleteMeal = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ success: false, message: 'Authentication required' });
        const { id } = req.params;
        const meal = await models_1.Meal.findOne({ where: { id, userId } });
        if (!meal)
            return res.status(404).json({ success: false, message: 'Meal not found' });
        await meal.destroy();
        return res.json({ success: true, message: 'Meal deleted' });
    }
    catch (error) {
        console.error('Delete meal error:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete meal', error: error.message });
    }
};
exports.deleteMeal = deleteMeal;
