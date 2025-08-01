import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// HbA1cReading attributes interface
interface HbA1cReadingAttributes {
  id: string;
  userId: string;
  value: number;           // e.g. 6.5
  unit: 'percent';               // stored as percentage
  takenAt: Date;
  source: 'manual' | 'lab_report';
  createdAt: Date;
  updatedAt: Date;
}

// Attributes for creation
interface HbA1cReadingCreationAttributes extends Optional<HbA1cReadingAttributes,
  'id' | 'unit' | 'takenAt' | 'source' | 'createdAt' | 'updatedAt'> {}

// HbA1cReading instance interface
interface HbA1cReadingInstance extends Model<HbA1cReadingAttributes, HbA1cReadingCreationAttributes>,
  HbA1cReadingAttributes {}

// Define model
const HbA1cReading = sequelize.define<HbA1cReadingInstance>('HbA1cReading', {
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
      min: 3,    // realistic lower bound
      max: 20    // realistic upper bound
    }
  },
  unit: {
    type: DataTypes.ENUM('percent'),
    allowNull: false,
    defaultValue: 'percent'
  },
  takenAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  source: {
    type: DataTypes.ENUM('manual', 'lab_report'),
    allowNull: false,
    defaultValue: 'manual'
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
  tableName: 'hba1c_readings',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['userId', 'takenAt']
    }
  ]
});

export default HbA1cReading; 