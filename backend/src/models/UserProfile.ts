import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { UserProfileInstance, UserProfileAttributes } from '../types';
import Auth from './Auth';

// UserProfile model definition
const UserProfile = sequelize.define<UserProfileInstance, UserProfileAttributes>(
  'UserProfile',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    authId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'auth_id',
      references: {
        model: 'auths',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name'
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'phone_number'
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'date_of_birth'
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
      allowNull: true
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'profile_image'
    },
    address: {
      type: DataTypes.JSON,
      allowNull: true
    },
    timezone: {
      type: DataTypes.STRING,
      defaultValue: 'UTC'
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: 'en'
    },
    notificationPreferences: {
      type: DataTypes.JSON,
      defaultValue: {},
      field: 'notification_preferences'
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
    tableName: 'user_profiles',
    timestamps: true,
    underscored: true
  }
);

// Define the relationship with Auth
UserProfile.belongsTo(Auth, { 
  foreignKey: 'authId',
  as: 'auth'
});

Auth.hasOne(UserProfile, {
  foreignKey: 'authId',
  as: 'userProfile'
});

export default UserProfile; 