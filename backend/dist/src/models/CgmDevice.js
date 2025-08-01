"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const CgmDevice = database_1.sequelize.define('CgmDevice', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    manufacturer: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    model: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    serialNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    pairedAt: {
        type: sequelize_1.DataTypes.DATE,
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
            fields: ['userId']
        },
        {
            unique: true,
            fields: ['serialNumber']
        }
    ]
});
exports.default = CgmDevice;
