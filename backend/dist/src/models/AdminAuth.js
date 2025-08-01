"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../config/database");
// AdminAuth model definition
const AdminAuth = database_1.sequelize.define('AdminAuth', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
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
    role: {
        type: sequelize_1.DataTypes.ENUM('admin', 'staff'),
        defaultValue: 'staff',
        allowNull: false,
    },
    isEmailVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_email_verified'
    },
    verificationToken: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: 'verification_token'
    },
    resetPasswordToken: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: 'reset_password_token'
    },
    resetTokenExpiresAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: 'reset_token_expires_at'
    },
    lastLogin: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: 'last_login'
    },
    loginAttempts: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        field: 'login_attempts'
    },
    isLocked: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_locked'
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
    tableName: 'admin_auths',
    timestamps: true,
    underscored: true,
    hooks: {
        beforeCreate: async (auth) => {
            if (auth.password) {
                auth.password = await bcrypt_1.default.hash(auth.password, 10);
            }
        },
        beforeUpdate: async (auth) => {
            if (auth.changed('password')) {
                auth.password = await bcrypt_1.default.hash(auth.password, 10);
            }
        },
    },
});
// Instance method for checking passwords
AdminAuth.prototype.checkPassword = async function (password) {
    return await bcrypt_1.default.compare(password, this.password);
};
exports.default = AdminAuth;
