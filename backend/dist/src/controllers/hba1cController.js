"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReading = exports.updateReading = exports.getReadingById = exports.getReadings = exports.createReading = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
// Create HbA1c reading
const createReading = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        const { value, takenAt, source } = req.body;
        if (!value || isNaN(value)) {
            return res.status(400).json({ success: false, message: 'Value is required and must be numeric' });
        }
        const reading = await models_1.HbA1cReading.create({
            userId,
            value,
            takenAt: takenAt || new Date(),
            source: source || 'manual'
        });
        return res.status(201).json({ success: true, message: 'HbA1c reading recorded', data: reading });
    }
    catch (error) {
        console.error('Create HbA1c error:', error);
        return res.status(500).json({ success: false, message: 'Failed to create HbA1c reading', error: error.message });
    }
};
exports.createReading = createReading;
// Get readings list
const getReadings = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        const { startDate, endDate, limit = '50', offset = '0' } = req.query;
        const where = { userId };
        if (startDate && endDate) {
            where.takenAt = { [sequelize_1.Op.between]: [new Date(startDate), new Date(endDate)] };
        }
        else if (startDate) {
            where.takenAt = { [sequelize_1.Op.gte]: new Date(startDate) };
        }
        else if (endDate) {
            where.takenAt = { [sequelize_1.Op.lte]: new Date(endDate) };
        }
        const result = await models_1.HbA1cReading.findAndCountAll({
            where,
            order: [['takenAt', 'DESC']],
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10)
        });
        return res.json({ success: true, data: { total: result.count, readings: result.rows } });
    }
    catch (error) {
        console.error('Get HbA1c readings error:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve HbA1c readings', error: error.message });
    }
};
exports.getReadings = getReadings;
// Get by id
const getReadingById = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ success: false, message: 'Authentication required' });
        const { id } = req.params;
        const reading = await models_1.HbA1cReading.findOne({ where: { id, userId } });
        if (!reading)
            return res.status(404).json({ success: false, message: 'HbA1c reading not found' });
        return res.json({ success: true, data: reading });
    }
    catch (error) {
        console.error('Get HbA1c by ID error:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve HbA1c reading', error: error.message });
    }
};
exports.getReadingById = getReadingById;
// Update reading
const updateReading = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ success: false, message: 'Authentication required' });
        const { id } = req.params;
        const { value, takenAt, source } = req.body;
        const reading = await models_1.HbA1cReading.findOne({ where: { id, userId } });
        if (!reading)
            return res.status(404).json({ success: false, message: 'HbA1c reading not found' });
        await reading.update({
            value: value !== null && value !== void 0 ? value : reading.value,
            takenAt: takenAt || reading.takenAt,
            source: source || reading.source
        });
        return res.json({ success: true, message: 'HbA1c reading updated', data: reading });
    }
    catch (error) {
        console.error('Update HbA1c error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update HbA1c reading', error: error.message });
    }
};
exports.updateReading = updateReading;
// Delete reading
const deleteReading = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ success: false, message: 'Authentication required' });
        const { id } = req.params;
        const reading = await models_1.HbA1cReading.findOne({ where: { id, userId } });
        if (!reading)
            return res.status(404).json({ success: false, message: 'HbA1c reading not found' });
        await reading.destroy();
        return res.json({ success: true, message: 'HbA1c reading deleted' });
    }
    catch (error) {
        console.error('Delete HbA1c error:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete HbA1c reading', error: error.message });
    }
};
exports.deleteReading = deleteReading;
