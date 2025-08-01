"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Auth_1 = __importDefault(require("./Auth"));
// UserProfile model definition
const UserProfile = database_1.sequelize.define('UserProfile', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    authId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        field: 'auth_id',
        references: {
            model: 'auths',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'first_name'
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'last_name'
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: 'phone_number'
    },
    dateOfBirth: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
        field: 'date_of_birth'
    },
    gender: {
        type: sequelize_1.DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
        allowNull: true
    },
    profileImage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: 'profile_image'
    },
    address: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true
    },
    timezone: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'UTC'
    },
    language: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'en'
    },
    notificationPreferences: {
        type: sequelize_1.DataTypes.JSON,
        defaultValue: {},
        field: 'notification_preferences'
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        field: 'created_at'
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        field: 'updated_at'
    }
}, {
    tableName: 'user_profiles',
    timestamps: true,
    underscored: true
});
// Define the relationship with Auth
UserProfile.belongsTo(Auth_1.default, {
    foreignKey: 'authId',
    as: 'auth'
});
Auth_1.default.hasOne(UserProfile, {
    foreignKey: 'authId',
    as: 'userProfile'
});
exports.default = UserProfile;
