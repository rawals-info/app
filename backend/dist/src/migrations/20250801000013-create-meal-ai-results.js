"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('meal_ai_results', {
        id: { allowNull: false, primaryKey: true, type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4 },
        meal_id: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: 'meals', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
        provider: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        payload: { type: sequelize_1.DataTypes.JSONB, allowNull: false },
        created_at: { allowNull: false, type: sequelize_1.DataTypes.DATE },
        updated_at: { allowNull: false, type: sequelize_1.DataTypes.DATE },
    });
    await queryInterface.addIndex('meal_ai_results', ['meal_id']);
}
async function down(queryInterface) {
    await queryInterface.dropTable('meal_ai_results');
}
