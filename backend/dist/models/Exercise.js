"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
// Define Exercise model
const Exercise = database_1.sequelize.define('Exercise', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    exerciseType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        comment: 'Walking, Running, Cycling, Swimming, Yoga, etc.'
    },
    category: {
        type: sequelize_1.DataTypes.ENUM('cardio', 'strength', 'flexibility', 'balance', 'other'),
        allowNull: false,
        defaultValue: 'cardio',
    },
    intensity: {
        type: sequelize_1.DataTypes.ENUM('low', 'moderate', 'high'),
        allowNull: true,
    },
    startTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    endTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    duration: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        comment: 'Duration in minutes'
    },
    caloriesBurned: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    distance: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
        comment: 'Distance in kilometers'
    },
    steps: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    heartRateAvg: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    heartRateMax: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    bloodSugarBefore: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    bloodSugarAfter: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
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
            fields: ['userId', 'startTime']
        },
        {
            fields: ['userId', 'exerciseType']
        }
    ]
});
exports.default = Exercise;
