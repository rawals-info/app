"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const QuestionCategory = database_1.sequelize.define('QuestionCategory', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    slug: {
        type: sequelize_1.DataTypes.ENUM('non_patient', 'at_risk', 'patient'),
        allowNull: false,
        unique: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    affirmationText: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        field: 'affirmation_text'
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
    tableName: 'question_categories',
    timestamps: true,
    underscored: true
});
exports.default = QuestionCategory;
