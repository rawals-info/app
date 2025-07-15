"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
// Define Recommendation model
const Recommendation = database_1.sequelize.define('Recommendation', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('food', 'exercise', 'medication', 'general', 'alert'),
        allowNull: false,
    },
    priority: {
        type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
        allowNull: false,
        defaultValue: 'medium',
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    suggestedAction: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    triggerType: {
        type: sequelize_1.DataTypes.ENUM('blood_sugar_high', 'blood_sugar_low', 'food_analysis', 'exercise_reminder', 'inactivity', 'pattern', 'scheduled', 'other'),
        allowNull: false,
    },
    triggerValue: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        comment: 'Additional trigger information such as blood sugar value, food item, etc.'
    },
    triggerDateTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    validUntil: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    isRead: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isDismissed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    actionTaken: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    actionDetails: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        comment: 'Details about what action was taken based on the recommendation'
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
            fields: ['userId', 'triggerDateTime']
        },
        {
            fields: ['userId', 'type']
        },
        {
            fields: ['userId', 'isRead']
        },
        {
            fields: ['userId', 'isDismissed']
        }
    ]
});
exports.default = Recommendation;
