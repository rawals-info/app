import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface LabReportAttributes {
  id: string;
  userId: string;
  filePath: string;
  parsed: boolean;
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface LabReportCreationAttributes extends Optional<LabReportAttributes,
  'id' | 'parsed' | 'uploadedAt' | 'createdAt' | 'updatedAt'> {}

interface LabReportInstance extends Model<LabReportAttributes, LabReportCreationAttributes>, LabReportAttributes {}

const LabReport = sequelize.define<LabReportInstance>('LabReport', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  parsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  uploadedAt: {
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
  },
}, {
  tableName: 'lab_reports',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['userId', 'uploadedAt'] }
  ]
});

export default LabReport; 