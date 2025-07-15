import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from '../config/database';

// AdminAuth attributes interface
export interface AdminAuthAttributes {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'staff';
  isEmailVerified: boolean;
  verificationToken?: string | null;
  resetPasswordToken?: string | null;
  resetTokenExpiresAt?: Date | null;
  lastLogin?: Date | null;
  loginAttempts: number;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Attributes for AdminAuth creation
export interface AdminAuthCreationAttributes {
  email: string;
  password: string;
  role?: 'admin' | 'staff';
  verificationToken?: string | null;
}

// AdminAuth instance interface
export interface AdminAuthInstance {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'staff';
  isEmailVerified: boolean;
  verificationToken?: string | null;
  resetPasswordToken?: string | null;
  resetTokenExpiresAt?: Date | null;
  lastLogin?: Date | null;
  loginAttempts: number;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  checkPassword(password: string): Promise<boolean>;
  adminProfile?: any;
}

// AdminAuth model definition
const AdminAuth = sequelize.define<any, AdminAuthAttributes>(
  'AdminAuth',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'staff'),
      defaultValue: 'staff',
      allowNull: false,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_email_verified'
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'verification_token'
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'reset_password_token'
    },
    resetTokenExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reset_token_expires_at'
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login'
    },
    loginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'login_attempts'
    },
    isLocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_locked'
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
    tableName: 'admin_auths',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (auth: any) => {
        if (auth.password) {
          auth.password = await bcrypt.hash(auth.password, 10);
        }
      },
      beforeUpdate: async (auth: any) => {
        if (auth.changed('password')) {
          auth.password = await bcrypt.hash(auth.password, 10);
        }
      },
    },
  }
);

// Instance method for checking passwords
(AdminAuth as any).prototype.checkPassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export default AdminAuth; 