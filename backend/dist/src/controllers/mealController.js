"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMeal = exports.updateMeal = exports.getMealById = exports.getMeals = exports.createMeal = void 0;
const models_1 = require("../models");
const createMeal = async (req, res) => {
    var _a;
    try {
        const authId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!authId)
            return res.status(401).json({ success: false, message: 'Authentication required' });
        const { mealType, loggedAt, inputMethod, location, moodBefore, hungerLevel, notes } = req.body;
        const meal = await models_1.Meal.create({
            userId: authId,
            mealType,
            loggedAt: loggedAt || new Date(),
            inputMethod,
            location,
            moodBefore,
            hungerLevel,
            notes,
        });
        return res.status(201).json({ success: true, data: meal });
    }
    catch (error) {
        console.error('Create meal error', error);
        return res.status(500).json({ success: false, message: 'Failed', error: error.message });
    }
};
exports.createMeal = createMeal;
const getMeals = async (req, res) => {
    var _a;
    try {
        const authId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!authId)
            return res.status(401).json({ success: false, message: 'Authentication required' });
        const meals = await models_1.Meal.findAll({ where: { userId: authId }, order: [['loggedAt', 'DESC']], include: [{ model: models_1.MealItem, as: 'items' }] });
        return res.json({ success: true, data: meals });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMeals = getMeals;
const getMealById = async (req, res) => {
    var _a;
    try {
        const authId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { id } = req.params;
        const meal = await models_1.Meal.findOne({ where: { id, userId: authId }, include: [{ model: models_1.MealItem, as: 'items' }] });
        if (!meal)
            return res.status(404).json({ success: false, message: 'Not found' });
        return res.json({ success: true, data: meal });
    }
    catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};
exports.getMealById = getMealById;
const updateMeal = async (req, res) => {
    var _a;
    try {
        const authId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { id } = req.params;
        const meal = await models_1.Meal.findOne({ where: { id, userId: authId } });
        if (!meal)
            return res.status(404).json({ success: false, message: 'Not found' });
        await meal.update(req.body);
        return res.json({ success: true, data: meal });
    }
    catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};
exports.updateMeal = updateMeal;
const deleteMeal = async (req, res) => {
    var _a;
    try {
        const authId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { id } = req.params;
        const meal = await models_1.Meal.findOne({ where: { id, userId: authId } });
        if (!meal)
            return res.status(404).json({ success: false, message: 'Not found' });
        await meal.destroy();
        return res.json({ success: true, message: 'Deleted' });
    }
    catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};
exports.deleteMeal = deleteMeal;
