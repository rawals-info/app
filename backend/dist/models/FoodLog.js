"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
// Define FoodLog model
const FoodLog = database_1.sequelize.define('FoodLog', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    mealType: {
        type: sequelize_1.DataTypes.ENUM('breakfast', 'lunch', 'dinner', 'snack'),
        allowNull: false,
    },
    consumptionTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    foodItems: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of food items with name, quantity, unit, calories, carbs, etc.'
    },
    totalCalories: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    totalCarbs: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    totalProtein: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    totalFat: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    totalSugar: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    imageUrls: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
    },
    aiAnalysis: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        comment: 'AI analysis results with nutritional assessment and recommendations'
    },
    notes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['userId', 'consumptionTime']
        },
        {
            fields: ['userId', 'mealType']
        }
    ]
});
exports.default = FoodLog;
