"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Meal = database_1.sequelize.define('Meal', {
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    userId: { type: sequelize_1.DataTypes.UUID, allowNull: false, field: 'user_id' },
    mealType: { type: sequelize_1.DataTypes.ENUM('breakfast', 'brunch', 'lunch', 'dinner', 'snack'), allowNull: false, field: 'meal_type' },
    loggedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, field: 'logged_at', defaultValue: sequelize_1.DataTypes.NOW },
    inputMethod: { type: sequelize_1.DataTypes.ENUM('photo', 'voice', 'quick_add', 'same_as_last'), allowNull: false, field: 'input_method' },
    location: { type: sequelize_1.DataTypes.JSON, allowNull: true },
    photoPath: { type: sequelize_1.DataTypes.STRING, allowNull: true, field: 'photo_path' },
    voicePath: { type: sequelize_1.DataTypes.STRING, allowNull: true, field: 'voice_path' },
    moodBefore: { type: sequelize_1.DataTypes.TEXT, allowNull: true, field: 'mood_before' },
    hungerLevel: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, field: 'hunger_level' },
    notes: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    aiStatus: { type: sequelize_1.DataTypes.ENUM('pending', 'processed', 'error'), defaultValue: 'pending', field: 'ai_status' },
    createdAt: { type: sequelize_1.DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: sequelize_1.DataTypes.DATE, field: 'updated_at' }
}, { tableName: 'meals', timestamps: true, underscored: true });
exports.default = Meal;
