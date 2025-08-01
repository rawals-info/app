"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable('user_goals', {
            id: {
                type: sequelize_1.DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
            },
            user_id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: { model: 'user_profiles', key: 'id' },
                onDelete: 'CASCADE',
            },
            goal: {
                type: sequelize_1.DataTypes.ENUM('prevent', 'monitor', 'diagnosed'),
                allowNull: false,
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('user_goals');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_user_goals_goal";');
    },
};
