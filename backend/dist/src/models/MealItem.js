"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Meal_1 = __importDefault(require("./Meal"));
const FoodItem_1 = __importDefault(require("./FoodItem"));
const MealItem = database_1.sequelize.define('MealItem', {
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    mealId: { type: sequelize_1.DataTypes.UUID, allowNull: false, field: 'meal_id' },
    foodItemId: { type: sequelize_1.DataTypes.UUID, allowNull: false, field: 'food_item_id' },
    variantId: { type: sequelize_1.DataTypes.UUID, allowNull: true, field: 'variant_id' },
    quantity: { type: sequelize_1.DataTypes.FLOAT, allowNull: false },
    unit: { type: sequelize_1.DataTypes.ENUM('g', 'ml', 'piece', 'cup', 'tbsp'), allowNull: false },
    caloriesEst: { type: sequelize_1.DataTypes.FLOAT, allowNull: true, field: 'calories_est' },
    giEst: { type: sequelize_1.DataTypes.FLOAT, allowNull: true, field: 'gi_est' },
    source: { type: sequelize_1.DataTypes.ENUM('user_estimate', 'ai_estimate', 'device'), allowNull: false },
    createdAt: { type: sequelize_1.DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: sequelize_1.DataTypes.DATE, field: 'updated_at' },
}, { tableName: 'meal_items', timestamps: true, underscored: true });
Meal_1.default.hasMany(MealItem, { foreignKey: 'mealId', as: 'items' });
MealItem.belongsTo(Meal_1.default, { foreignKey: 'mealId', as: 'meal' });
FoodItem_1.default.hasMany(MealItem, { foreignKey: 'foodItemId', as: 'mealUsages' });
MealItem.belongsTo(FoodItem_1.default, { foreignKey: 'foodItemId', as: 'foodItem' });
exports.default = MealItem;
