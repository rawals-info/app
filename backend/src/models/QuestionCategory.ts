import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { QuestionCategoryInstance, QuestionCategoryAttributes } from '../types';

const QuestionCategory = sequelize.define<QuestionCategoryInstance, QuestionCategoryAttributes>(
  'QuestionCategory',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    slug: {
      type: DataTypes.ENUM('non_patient', 'at_risk', 'patient'),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    affirmationText: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'affirmation_text'
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
    tableName: 'question_categories',
    timestamps: true,
    underscored: true
  }
);

export default QuestionCategory; 