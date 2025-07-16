import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { QuestionAnswerInstance, QuestionAnswerAttributes } from '../types';
import Question from './Question';
import UserProfile from './UserProfile';

const QuestionAnswer = sequelize.define<QuestionAnswerInstance, QuestionAnswerAttributes>(
  'QuestionAnswer',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
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
      type: DataTypes.UUID,
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
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'answer_value'
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
    tableName: 'question_answers',
    timestamps: true,
    underscored: true
  }
);

QuestionAnswer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });
Question.hasMany(QuestionAnswer, { foreignKey: 'questionId', as: 'answers' });

QuestionAnswer.belongsTo(UserProfile, { foreignKey: 'userId', as: 'userProfile' });
UserProfile.hasMany(QuestionAnswer, { foreignKey: 'userId', as: 'questionAnswers' });

export default QuestionAnswer; 