"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const AdminAuth_1 = __importDefault(require("./AdminAuth"));
// AdminProfile model definition
const AdminProfile = database_1.sequelize.define('AdminProfile', {
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
            model: 'admin_auths',
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
    department: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    position: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: 'phone_number'
    },
    profileImage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: 'profile_image'
    },
    permissions: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true
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
    tableName: 'admin_profiles',
    timestamps: true,
    underscored: true
});
// Define the relationship with AdminAuth
AdminProfile.belongsTo(AdminAuth_1.default, {
    foreignKey: 'authId',
    as: 'auth'
});
AdminAuth_1.default.hasOne(AdminProfile, {
    foreignKey: 'authId',
    as: 'adminProfile'
});
exports.default = AdminProfile;
