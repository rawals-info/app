import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import AdminAuth from './AdminAuth';

// AdminProfile attributes interface
export interface AdminProfileAttributes {
  id: string;
  authId: string;
  firstName: string;
  lastName: string;
  department?: string | null;
  position?: string | null;
  phoneNumber?: string | null;
  profileImage?: string | null;
  permissions?: any | null;
  createdAt: Date;
  updatedAt: Date;
}

// Attributes for AdminProfile creation
export interface AdminProfileCreationAttributes {
  authId: string;
  firstName: string;
  lastName: string;
  department?: string | null;
  position?: string | null;
  phoneNumber?: string | null;
}

// AdminProfile instance interface
export interface AdminProfileInstance {
  id: string;
  authId: string;
  firstName: string;
  lastName: string;
  department?: string | null;
  position?: string | null;
  phoneNumber?: string | null;
  profileImage?: string | null;
  permissions?: any | null;
  createdAt: Date;
  updatedAt: Date;
  auth?: any; 
}

// AdminProfile model definition
const AdminProfile = sequelize.define<any, AdminProfileAttributes>(
  'AdminProfile',
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
        model: 'admin_auths',
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
    department: {
      type: DataTypes.STRING,
      allowNull: true
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'phone_number'
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'profile_image'
    },
    permissions: {
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
    tableName: 'admin_profiles',
    timestamps: true,
    underscored: true
  }
);

// Define the relationship with AdminAuth
AdminProfile.belongsTo(AdminAuth, { 
  foreignKey: 'authId',
  as: 'auth'
});

AdminAuth.hasOne(AdminProfile, {
  foreignKey: 'authId',
  as: 'adminProfile'
});

export default AdminProfile; 