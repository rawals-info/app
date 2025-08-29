"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('meal_items', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
        },
        meal_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'meals', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        food_item_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'food_items', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        variant_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        quantity: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
        },
        unit: {
            type: sequelize_1.DataTypes.ENUM('g', 'ml', 'piece', 'cup', 'tbsp'),
            allowNull: false,
        },
        calories_est: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
        },
        gi_est: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: true,
        },
        source: {
            type: sequelize_1.DataTypes.ENUM('user_estimate', 'ai_estimate', 'device'),
            allowNull: false,
        },
        created_at: { allowNull: false, type: sequelize_1.DataTypes.DATE },
        updated_at: { allowNull: false, type: sequelize_1.DataTypes.DATE },
    });
}
async function down(queryInterface) {
    await queryInterface.dropTable('meal_items');
}
