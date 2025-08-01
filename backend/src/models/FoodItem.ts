import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface FoodItemAttributes {
  id: string;
  name: string;
  variant?: string | null;
  baseGi?: number | null;
  macroProfile?: any | null; // {protein, carbs, fat, fiber}
  culturalTags?: any | null;
  createdAt: Date;
  updatedAt: Date;
}

interface FoodItemCreationAttributes extends Optional<FoodItemAttributes, 'id' | 'variant' | 'baseGi' | 'macroProfile' | 'culturalTags' | 'createdAt' | 'updatedAt'> {}

interface FoodItemInstance extends Model<FoodItemAttributes, FoodItemCreationAttributes>, FoodItemAttributes {}

const FoodItem = sequelize.define<FoodItemInstance>('FoodItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  variant: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  baseGi: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'base_gi',
  },
  macroProfile: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'macro_profile',
  },
  culturalTags: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'cultural_tags',
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
  }
}, {
  tableName: 'food_items',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['name', 'variant'], unique: true }
  ]
});

export default FoodItem; 