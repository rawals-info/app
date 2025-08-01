"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const LabReport = database_1.sequelize.define('LabReport', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    filePath: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    parsed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    uploadedAt: {
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
    },
}, {
    timestamps: true,
    indexes: [
        { fields: ['userId', 'uploadedAt'] }
    ]
});
exports.default = LabReport;
