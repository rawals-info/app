import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { HealthProfileInstance, HealthProfileAttributes } from '../types';
import UserProfile from './UserProfile';

// HealthProfile model definition
const HealthProfile = sequelize.define<HealthProfileInstance, HealthProfileAttributes>(
  'HealthProfile',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true, // enforce 1-to-1 with user_profile
      field: 'user_id',
      references: {
        model: 'user_profiles',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    diabetesType: {
      type: DataTypes.ENUM('type1', 'type2', 'gestational', 'prediabetes', 'other'),
      allowNull: true,
      field: 'diabetes_type'
    },
    diagnosisDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'diagnosis_date'
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    weightUnit: {
      type: DataTypes.ENUM('kg', 'lb'),
      defaultValue: 'kg',
      field: 'weight_unit'
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    heightUnit: {
      type: DataTypes.ENUM('cm', 'ft'),
      defaultValue: 'cm',
      field: 'height_unit'
    },
    targetBloodSugarMin: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 70,
      field: 'target_blood_sugar_min'
    },
    targetBloodSugarMax: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 180,
      field: 'target_blood_sugar_max'
    },
    bloodSugarUnit: {
      type: DataTypes.ENUM('mg/dL', 'mmol/L'),
      defaultValue: 'mg/dL',
      field: 'blood_sugar_unit'
    },
    medications: {
      type: DataTypes.JSON,
      allowNull: true
    },
    allergies: {
      type: DataTypes.JSON,
      allowNull: true
    },
    medicalConditions: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'medical_conditions'
    },
    familyHistory: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'family_history'
    },
    lifestyle: {
      type: DataTypes.JSON,
      allowNull: true
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
    tableName: 'health_profiles',
    timestamps: true,
    underscored: true
  }
);

// Define relationship with UserProfile
HealthProfile.belongsTo(UserProfile, {
  foreignKey: 'userId',
  as: 'userProfile'
});

UserProfile.hasOne(HealthProfile, {
  foreignKey: 'userId',
  as: 'healthProfile'
});

export default HealthProfile; 