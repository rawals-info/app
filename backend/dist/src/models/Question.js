"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const QuestionCategory_1 = __importDefault(require("./QuestionCategory"));
const Question = database_1.sequelize.define('Question', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    categoryId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        field: 'category_id',
        references: {
            model: 'question_categories',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    questionText: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        field: 'question_text'
    },
    responseType: {
        type: sequelize_1.DataTypes.ENUM('mcq', 'numeric', 'yes_no'),
        allowNull: false,
        field: 'response_type'
    },
    options: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true
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
    tableName: 'questions',
    timestamps: true,
    underscored: true
});
Question.belongsTo(QuestionCategory_1.default, { foreignKey: 'categoryId', as: 'category' });
QuestionCategory_1.default.hasMany(Question, { foreignKey: 'categoryId', as: 'questions' });
exports.default = Question;
