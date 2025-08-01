"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const RecommendationRule = database_1.sequelize.define('RecommendationRule', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    categorySlug: {
        type: sequelize_1.DataTypes.ENUM('non_patient', 'at_risk', 'patient'),
        allowNull: false,
        field: 'category_slug'
    },
    conditions: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    summary: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    order: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
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
    tableName: 'recommendation_rules',
    timestamps: true,
    underscored: true
});
exports.default = RecommendationRule;
