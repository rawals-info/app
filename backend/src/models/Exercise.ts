import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Exercise attributes interface
interface ExerciseAttributes {
  id: string;
  userId: string;
  exerciseType: string;
  category: 'cardio' | 'strength' | 'flexibility' | 'balance' | 'other';
  intensity?: 'low' | 'moderate' | 'high' | null;
  startTime: Date;
  endTime?: Date | null;
  duration?: number | null;
  caloriesBurned?: number | null;
  distance?: number | null;
  steps?: number | null;
  heartRateAvg?: number | null;
  heartRateMax?: number | null;
  bloodSugarBefore?: number | null;
  bloodSugarAfter?: number | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Attributes for Exercise creation
interface ExerciseCreationAttributes extends Optional<ExerciseAttributes, 
  'id' | 'category' | 'startTime' | 'createdAt' | 'updatedAt'> {}

// Exercise instance interface
interface ExerciseInstance extends Model<ExerciseAttributes, ExerciseCreationAttributes>, 
  ExerciseAttributes {}

// Define Exercise model
const Exercise = sequelize.define<ExerciseInstance>('Exercise', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  exerciseType: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Walking, Running, Cycling, Swimming, Yoga, etc.'
  },
  category: {
    type: DataTypes.ENUM('cardio', 'strength', 'flexibility', 'balance', 'other'),
    allowNull: false,
    defaultValue: 'cardio',
  },
  intensity: {
    type: DataTypes.ENUM('low', 'moderate', 'high'),
    allowNull: true,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in minutes'
  },
  caloriesBurned: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  distance: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Distance in kilometers'
  },
  steps: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  heartRateAvg: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  heartRateMax: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  bloodSugarBefore: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  bloodSugarAfter: {
    type: DataTypes.FLOAT,
    allowNull: true,
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
      fields: ['userId', 'startTime']
    },
    {
      fields: ['userId', 'exerciseType']
    }
  ]
});

export default Exercise; 