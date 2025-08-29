"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Meal_1 = __importDefault(require("./Meal"));
const MealAiResult = database_1.sequelize.define('MealAiResult', {
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    mealId: { type: sequelize_1.DataTypes.UUID, allowNull: false, field: 'meal_id' },
    provider: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    payload: { type: sequelize_1.DataTypes.JSONB, allowNull: false },
    createdAt: { type: sequelize_1.DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: sequelize_1.DataTypes.DATE, field: 'updated_at' },
}, { tableName: 'meal_ai_results', timestamps: true, underscored: true });
Meal_1.default.hasMany(MealAiResult, { foreignKey: 'mealId', as: 'aiResults' });
MealAiResult.belongsTo(Meal_1.default, { foreignKey: 'mealId', as: 'meal' });
exports.default = MealAiResult;
