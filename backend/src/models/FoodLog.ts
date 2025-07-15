import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// FoodLog attributes interface
interface FoodLogAttributes {
  id: string;
  userId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  consumptionTime: Date;
  foodItems: any[];
  totalCalories?: number | null;
  totalCarbs?: number | null;
  totalProtein?: number | null;
  totalFat?: number | null;
  totalSugar?: number | null;
  imageUrls?: string[] | null;
  aiAnalysis?: any | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Attributes for FoodLog creation
interface FoodLogCreationAttributes extends Optional<FoodLogAttributes, 
  'id' | 'foodItems' | 'consumptionTime' | 'imageUrls' | 'createdAt' | 'updatedAt'> {}

// FoodLog instance interface
interface FoodLogInstance extends Model<FoodLogAttributes, FoodLogCreationAttributes>, 
  FoodLogAttributes {}

// Define FoodLog model
const FoodLog = sequelize.define<FoodLogInstance>('FoodLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  mealType: {
    type: DataTypes.ENUM('breakfast', 'lunch', 'dinner', 'snack'),
    allowNull: false,
  },
  consumptionTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  foodItems: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    comment: 'Array of food items with name, quantity, unit, calories, carbs, etc.'
  },
  totalCalories: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  totalCarbs: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  totalProtein: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  totalFat: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  totalSugar: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  imageUrls: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
  },
  aiAnalysis: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'AI analysis results with nutritional assessment and recommendations'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
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
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'consumptionTime']
    },
    {
      fields: ['userId', 'mealType']
    }
  ]
});

export default FoodLog; 