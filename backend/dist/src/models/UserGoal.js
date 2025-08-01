"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const UserProfile_1 = __importDefault(require("./UserProfile"));
const database_1 = require("../config/database");
class UserGoal extends sequelize_1.Model {
    static initialize(sequelize) {
        UserGoal.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            userId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                field: 'user_id',
            },
            goal: {
                type: sequelize_1.DataTypes.ENUM('prevent', 'monitor', 'diagnosed'),
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: 'user_goals',
            underscored: true,
        });
    }
    static associate() {
        UserGoal.belongsTo(UserProfile_1.default, { foreignKey: 'userId', as: 'userProfile' });
    }
}
// Immediately initialize the model so it is registered with Sequelize
UserGoal.initialize(database_1.sequelize);
UserGoal.associate();
exports.default = UserGoal;
