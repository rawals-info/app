import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import UserProfile from './UserProfile';

export interface UserGoalAttributes {
  id: string;
  userId: string;
  goal: 'prevent' | 'monitor' | 'diagnosed';
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserGoalCreation = Optional<UserGoalAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class UserGoal extends Model<UserGoalAttributes, UserGoalCreation> implements UserGoalAttributes {
  public id!: string;
  public userId!: string;
  public goal!: 'prevent' | 'monitor' | 'diagnosed';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize) {
    UserGoal.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'user_id',
        },
        goal: {
          type: DataTypes.ENUM('prevent', 'monitor', 'diagnosed'),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'user_goals',
        underscored: true,
      },
    );
  }

  static associate() {
    UserGoal.belongsTo(UserProfile, { foreignKey: 'userId', as: 'userProfile' });
  }
}

export default UserGoal; 