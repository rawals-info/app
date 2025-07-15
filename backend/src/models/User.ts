import bcrypt from 'bcrypt';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// User attributes interface
interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth?: Date | null;
  gender?: 'male' | 'female' | 'other' | null;
  weight?: number | null;
  height?: number | null;
  diabetesType?: 'type1' | 'type2' | 'gestational' | 'prediabetes' | 'other' | null;
  diagnosisDate?: Date | null;
  targetBloodSugarMin?: number | null;
  targetBloodSugarMax?: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Attributes for User creation
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'isActive' | 'createdAt' | 'updatedAt'> {}

// User instance interface with methods
interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
  checkPassword(password: string): Promise<boolean>;
}

// Define User model
const User = sequelize.define<UserInstance>(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
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
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    diabetesType: {
      type: DataTypes.ENUM('type1', 'type2', 'gestational', 'prediabetes', 'other'),
      allowNull: true,
    },
    diagnosisDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    targetBloodSugarMin: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    targetBloodSugarMax: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user: UserInstance) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user: UserInstance) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

// Fix prototype method typing
(User.prototype as any).checkPassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export default User; 