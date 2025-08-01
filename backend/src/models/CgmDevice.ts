import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface CgmDeviceAttributes {
  id: string;
  userId: string;
  manufacturer?: string | null;
  model?: string | null;
  serialNumber?: string | null;
  pairedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CgmDeviceCreationAttributes extends Optional<CgmDeviceAttributes,
  'id' | 'manufacturer' | 'model' | 'serialNumber' | 'pairedAt' | 'createdAt' | 'updatedAt'> {}

interface CgmDeviceInstance extends Model<CgmDeviceAttributes, CgmDeviceCreationAttributes>, CgmDeviceAttributes {}

const CgmDevice = sequelize.define<CgmDeviceInstance>('CgmDevice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  serialNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  pairedAt: {
    type: DataTypes.DATE,
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
  tableName: 'cgm_devices',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      unique: true,
      fields: ['serialNumber']
    }
  ]
});

export default CgmDevice; 