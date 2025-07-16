import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { RecommendationRuleInstance, RecommendationRuleAttributes } from '../types';

const RecommendationRule = sequelize.define<RecommendationRuleInstance, RecommendationRuleAttributes>('RecommendationRule', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  categorySlug: {
    type: DataTypes.ENUM('non_patient', 'at_risk', 'patient'),
    allowNull: false,
    field: 'category_slug'
  },
  conditions: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: false
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
}, {
  tableName: 'recommendation_rules',
  timestamps: true,
  underscored: true
});

export default RecommendationRule; 