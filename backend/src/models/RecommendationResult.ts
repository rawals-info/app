import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { RecommendationResultInstance, RecommendationResultAttributes } from '../types';
import RecommendationRule from './RecommendationRule';
import UserProfile from './UserProfile';

const RecommendationResult = sequelize.define<RecommendationResultInstance, RecommendationResultAttributes>('RecommendationResult', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: { model: 'user_profiles', key: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  ruleId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'rule_id',
    references: { model: 'recommendation_rules', key: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  questionnaireSnapshot: {
    type: DataTypes.JSONB,
    allowNull: false,
    field: 'questionnaire_snapshot'
  },
  createdAt: { type: DataTypes.DATE, field: 'created_at' },
  updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
}, {
  tableName: 'recommendation_results',
  timestamps: true,
  underscored: true
});

RecommendationResult.belongsTo(RecommendationRule, { foreignKey: 'ruleId', as: 'rule' });
RecommendationRule.hasMany(RecommendationResult, { foreignKey: 'ruleId', as: 'results' });

RecommendationResult.belongsTo(UserProfile, { foreignKey: 'userId', as: 'userProfile' });
UserProfile.hasMany(RecommendationResult, { foreignKey: 'userId', as: 'recommendationResults' });

export default RecommendationResult; 