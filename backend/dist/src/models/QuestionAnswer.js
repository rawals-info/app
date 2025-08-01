"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Question_1 = __importDefault(require("./Question"));
const UserProfile_1 = __importDefault(require("./UserProfile"));
const QuestionAnswer = database_1.sequelize.define('QuestionAnswer', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
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
    questionId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        field: 'question_id',
        references: {
            model: 'questions',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    answerValue: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        field: 'answer_value'
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
    tableName: 'question_answers',
    timestamps: true,
    underscored: true
});
QuestionAnswer.belongsTo(Question_1.default, { foreignKey: 'questionId', as: 'question' });
Question_1.default.hasMany(QuestionAnswer, { foreignKey: 'questionId', as: 'answers' });
QuestionAnswer.belongsTo(UserProfile_1.default, { foreignKey: 'userId', as: 'userProfile' });
UserProfile_1.default.hasMany(QuestionAnswer, { foreignKey: 'userId', as: 'questionAnswers' });
exports.default = QuestionAnswer;
