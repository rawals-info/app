"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
// Define BloodSugarReading model
const BloodSugarReading = database_1.sequelize.define('BloodSugarReading', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    value: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0, // Non-negative values only
        },
    },
    unit: {
        type: sequelize_1.DataTypes.ENUM('mg/dL', 'mmol/L'),
        allowNull: false,
        defaultValue: 'mg/dL',
    },
    readingDateTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'reading_datetime',
    },
    readingType: {
        type: sequelize_1.DataTypes.ENUM('fasting', 'before_meal', 'after_meal', 'before_exercise', 'after_exercise', 'bedtime', 'random', 'continuous_monitor'),
        allowNull: false,
        defaultValue: 'random',
    },
    entryMethod: {
        type: sequelize_1.DataTypes.ENUM('manual', 'device', 'api'),
        allowNull: false,
        defaultValue: 'manual',
    },
    deviceInfo: {
        type: sequelize_1.DataTypes.JSON,
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
    tableName: 'blood_sugar_readings',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['user_id', 'reading_datetime'],
        },
    ],
});
exports.default = BloodSugarReading;
