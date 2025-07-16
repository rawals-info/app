import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { QuestionInstance, QuestionAttributes } from '../types';
import QuestionCategory from './QuestionCategory';

const Question = sequelize.define<QuestionInstance, QuestionAttributes>(
  'Question',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    categoryId: {
      type: DataTypes.UUID,
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
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'question_text'
    },
    responseType: {
      type: DataTypes.ENUM('mcq', 'numeric', 'yes_no'),
      allowNull: false,
      field: 'response_type'
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  },
  {
    tableName: 'questions',
    timestamps: true,
    underscored: true
  }
);

Question.belongsTo(QuestionCategory, { foreignKey: 'categoryId', as: 'category' });
QuestionCategory.hasMany(Question, { foreignKey: 'categoryId', as: 'questions' });

export default Question; 