import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface CgmSampleAttributes {
  id: number;          // bigserial
  deviceId: string;
  userId: string;
  value: number;
  unit: 'mg/dL' | 'mmol/L';
  sampledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface CgmSampleCreationAttributes extends Optional<CgmSampleAttributes,
  'id' | 'unit' | 'sampledAt' | 'createdAt' | 'updatedAt'> {}

interface CgmSampleInstance extends Model<CgmSampleAttributes, CgmSampleCreationAttributes>, CgmSampleAttributes {}

const CgmSample = sequelize.define<CgmSampleInstance>('CgmSample', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  deviceId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  unit: {
    type: DataTypes.ENUM('mg/dL', 'mmol/L'),
    allowNull: false,
    defaultValue: 'mg/dL'
  },
  sampledAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
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
  tableName: 'cgm_samples',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['userId', 'sampledAt'] },
    { fields: ['deviceId', 'sampledAt'] }
  ]
});

export default CgmSample; 