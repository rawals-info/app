"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const CgmSample = database_1.sequelize.define('CgmSample', {
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    deviceId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    value: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    unit: {
        type: sequelize_1.DataTypes.ENUM('mg/dL', 'mmol/L'),
        allowNull: false,
        defaultValue: 'mg/dL'
    },
    sampledAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
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
    tableName: 'cgm_samples',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['userId', 'sampledAt'] },
        { fields: ['deviceId', 'sampledAt'] }
    ]
});
exports.default = CgmSample;
