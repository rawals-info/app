"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
// Define User model
const User = database_1.sequelize.define('User', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    dateOfBirth: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
    gender: {
        type: sequelize_1.DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true,
    },
    weight: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    height: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    diabetesType: {
        type: sequelize_1.DataTypes.ENUM('type1', 'type2', 'gestational', 'prediabetes', 'other'),
        allowNull: true,
    },
    diagnosisDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
    targetBloodSugarMin: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    targetBloodSugarMax: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
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
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await bcrypt_1.default.hash(user.password, 10);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt_1.default.hash(user.password, 10);
            }
        },
    },
});
// Fix prototype method typing
User.prototype.checkPassword = async function (password) {
    return await bcrypt_1.default.compare(password, this.password);
};
exports.default = User;
