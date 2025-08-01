import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface MealAttributes {
  id: string;
  userId: string;
  consumedAt: Date;
  description?: string | null;
  carbsGrams?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface MealCreationAttributes extends Optional<MealAttributes, 'id' | 'description' | 'carbsGrams' | 'createdAt' | 'updatedAt'> {}

interface MealInstance extends Model<MealAttributes, MealCreationAttributes>, MealAttributes {}

const Meal = sequelize.define<MealInstance>('Meal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  consumedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  carbsGrams: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'carbs_g',
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
  },
}, {
  tableName: 'meals',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['userId', 'consumedAt']
    }
  ]
});

export default Meal; 