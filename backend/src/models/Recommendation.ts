import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Recommendation attributes interface
interface RecommendationAttributes {
  id: string;
  userId: string;
  type: 'food' | 'exercise' | 'medication' | 'general' | 'alert';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  suggestedAction?: string | null;
  triggerType: 'blood_sugar_high' | 'blood_sugar_low' | 'food_analysis' | 
               'exercise_reminder' | 'inactivity' | 'pattern' | 'scheduled' | 'other';
  triggerValue?: any | null;
  triggerDateTime: Date;
  validUntil?: Date | null;
  isRead: boolean;
  isDismissed: boolean;
  actionTaken: boolean;
  actionDetails?: any | null;
  createdAt: Date;
  updatedAt: Date;
}

// Attributes for Recommendation creation
interface RecommendationCreationAttributes extends Optional<RecommendationAttributes, 
  'id' | 'priority' | 'triggerDateTime' | 'isRead' | 'isDismissed' | 'actionTaken' | 'createdAt' | 'updatedAt'> {}

// Recommendation instance interface
interface RecommendationInstance extends Model<RecommendationAttributes, RecommendationCreationAttributes>, 
  RecommendationAttributes {}

// Define Recommendation model
const Recommendation = sequelize.define<RecommendationInstance>('Recommendation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('food', 'exercise', 'medication', 'general', 'alert'),
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    allowNull: false,
    defaultValue: 'medium',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  suggestedAction: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  triggerType: {
    type: DataTypes.ENUM('blood_sugar_high', 'blood_sugar_low', 'food_analysis', 
                         'exercise_reminder', 'inactivity', 'pattern', 'scheduled', 'other'),
    allowNull: false,
  },
  triggerValue: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional trigger information such as blood sugar value, food item, etc.'
  },
  triggerDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isDismissed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  actionTaken: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  actionDetails: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Details about what action was taken based on the recommendation'
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
      fields: ['userId', 'triggerDateTime']
    },
    {
      fields: ['userId', 'type']
    },
    {
      fields: ['userId', 'isRead']
    },
    {
      fields: ['userId', 'isDismissed']
    }
  ]
});

export default Recommendation; 