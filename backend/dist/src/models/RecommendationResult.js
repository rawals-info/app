"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const RecommendationRule_1 = __importDefault(require("./RecommendationRule"));
const UserProfile_1 = __importDefault(require("./UserProfile"));
const RecommendationResult = database_1.sequelize.define('RecommendationResult', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
        references: { model: 'user_profiles', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    ruleId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        field: 'rule_id',
        references: { model: 'recommendation_rules', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    questionnaireSnapshot: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        field: 'questionnaire_snapshot'
    },
    createdAt: { type: sequelize_1.DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: sequelize_1.DataTypes.DATE, field: 'updated_at' }
}, {
    tableName: 'recommendation_results',
    timestamps: true,
    underscored: true
});
RecommendationResult.belongsTo(RecommendationRule_1.default, { foreignKey: 'ruleId', as: 'rule' });
RecommendationRule_1.default.hasMany(RecommendationResult, { foreignKey: 'ruleId', as: 'results' });
RecommendationResult.belongsTo(UserProfile_1.default, { foreignKey: 'userId', as: 'userProfile' });
UserProfile_1.default.hasMany(RecommendationResult, { foreignKey: 'userId', as: 'recommendationResults' });
exports.default = RecommendationResult;
