"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const UserProfile_1 = __importDefault(require("./UserProfile"));
// HealthProfile model definition
const HealthProfile = database_1.sequelize.define('HealthProfile', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        unique: true, // enforce 1-to-1 with user_profile
        field: 'user_id',
        references: {
            model: 'user_profiles',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    diabetesType: {
        type: sequelize_1.DataTypes.ENUM('type1', 'type2', 'gestational', 'prediabetes', 'other'),
        allowNull: true,
        field: 'diabetes_type'
    },
    diagnosisDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
        field: 'diagnosis_date'
    },
    weight: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    weightUnit: {
        type: sequelize_1.DataTypes.ENUM('kg', 'lb'),
        defaultValue: 'kg',
        field: 'weight_unit'
    },
    height: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    heightUnit: {
        type: sequelize_1.DataTypes.ENUM('cm', 'ft'),
        defaultValue: 'cm',
        field: 'height_unit'
    },
    targetBloodSugarMin: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 70,
        field: 'target_blood_sugar_min'
    },
    targetBloodSugarMax: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 180,
        field: 'target_blood_sugar_max'
    },
    bloodSugarUnit: {
        type: sequelize_1.DataTypes.ENUM('mg/dL', 'mmol/L'),
        defaultValue: 'mg/dL',
        field: 'blood_sugar_unit'
    },
    medications: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true
    },
    allergies: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true
    },
    medicalConditions: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        field: 'medical_conditions'
    },
    familyHistory: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        field: 'family_history'
    },
    lifestyle: {
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
    tableName: 'health_profiles',
    timestamps: true,
    underscored: true
});
// Define relationship with UserProfile
HealthProfile.belongsTo(UserProfile_1.default, {
    foreignKey: 'userId',
    as: 'userProfile'
});
UserProfile_1.default.hasOne(HealthProfile, {
    foreignKey: 'userId',
    as: 'healthProfile'
});
exports.default = HealthProfile;
