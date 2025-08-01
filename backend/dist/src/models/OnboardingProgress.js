"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const UserProfile_1 = __importDefault(require("./UserProfile"));
// OnboardingProgress model definition
const OnboardingProgress = database_1.sequelize.define('OnboardingProgress', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'user_profiles',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    currentStep: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'profile_setup',
        field: 'current_step'
    },
    isComplete: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_complete'
    },
    completedSteps: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        defaultValue: [],
        field: 'completed_steps'
    },
    stepData: {
        type: sequelize_1.DataTypes.JSON,
        defaultValue: {},
        field: 'step_data'
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
    tableName: 'onboarding_progress',
    timestamps: true,
    underscored: true
});
// Define relationship with UserProfile
OnboardingProgress.belongsTo(UserProfile_1.default, {
    foreignKey: 'userId',
    as: 'userProfile'
});
UserProfile_1.default.hasOne(OnboardingProgress, {
    foreignKey: 'userId',
    as: 'onboardingProgress'
});
exports.default = OnboardingProgress;
