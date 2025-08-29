"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
// Define model
const HbA1cReading = database_1.sequelize.define('HbA1cReading', {
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
            min: 3, // realistic lower bound
            max: 20 // realistic upper bound
        }
    },
    unit: {
        type: sequelize_1.DataTypes.ENUM('percent'),
        allowNull: false,
        defaultValue: 'percent'
    },
    takenAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    source: {
        type: sequelize_1.DataTypes.ENUM('manual', 'lab_report'),
        allowNull: false,
        defaultValue: 'manual'
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
    },
}, {
    tableName: 'hba1c_readings',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['userId', 'takenAt']
        }
    ]
});
exports.default = HbA1cReading;
