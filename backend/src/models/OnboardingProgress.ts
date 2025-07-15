import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { OnboardingProgressInstance, OnboardingProgressAttributes } from '../types';
import UserProfile from './UserProfile';

// OnboardingProgress model definition
const OnboardingProgress = sequelize.define<OnboardingProgressInstance, OnboardingProgressAttributes>(
  'OnboardingProgress',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    currentStep: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'profile_setup',
      field: 'current_step'
    },
    isComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_complete'
    },
    completedSteps: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      field: 'completed_steps'
    },
    stepData: {
      type: DataTypes.JSON,
      defaultValue: {},
      field: 'step_data'
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
    tableName: 'onboarding_progress',
    timestamps: true,
    underscored: true
  }
);

// Define relationship with UserProfile
OnboardingProgress.belongsTo(UserProfile, {
  foreignKey: 'userId',
  as: 'userProfile'
});

UserProfile.hasOne(OnboardingProgress, {
  foreignKey: 'userId',
  as: 'onboardingProgress'
});

export default OnboardingProgress; 