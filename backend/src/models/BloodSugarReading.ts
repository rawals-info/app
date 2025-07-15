import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// BloodSugarReading attributes interface
interface BloodSugarReadingAttributes {
  id: string;
  userId: string;
  value: number;
  unit: 'mg/dL' | 'mmol/L';
  readingDateTime: Date;
  readingType: 'fasting' | 'before_meal' | 'after_meal' | 'before_exercise' | 
               'after_exercise' | 'bedtime' | 'random' | 'continuous_monitor';
  entryMethod: 'manual' | 'device' | 'api';
  deviceInfo?: any | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Attributes for BloodSugarReading creation
interface BloodSugarReadingCreationAttributes extends Optional<BloodSugarReadingAttributes, 
  'id' | 'unit' | 'readingDateTime' | 'readingType' | 'entryMethod' | 'createdAt' | 'updatedAt'> {}

// BloodSugarReading instance interface
interface BloodSugarReadingInstance extends Model<BloodSugarReadingAttributes, BloodSugarReadingCreationAttributes>, 
  BloodSugarReadingAttributes {}

// Define BloodSugarReading model
const BloodSugarReading = sequelize.define<BloodSugarReadingInstance>(
  'BloodSugarReading',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0, // Non-negative values only
      },
    },
    unit: {
      type: DataTypes.ENUM('mg/dL', 'mmol/L'),
      allowNull: false,
      defaultValue: 'mg/dL',
    },
    readingDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    readingType: {
      type: DataTypes.ENUM(
        'fasting',
        'before_meal',
        'after_meal',
        'before_exercise',
        'after_exercise',
        'bedtime',
        'random',
        'continuous_monitor',
      ),
      allowNull: false,
      defaultValue: 'random',
    },
    entryMethod: {
      type: DataTypes.ENUM('manual', 'device', 'api'),
      allowNull: false,
      defaultValue: 'manual',
    },
    deviceInfo: {
      type: DataTypes.JSON,
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
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ['userId', 'readingDateTime'],
      },
    ],
  },
);

export default BloodSugarReading; 