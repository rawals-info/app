"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('recommendation_rules', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4
        },
        category_slug: {
            type: sequelize_1.DataTypes.ENUM('non_patient', 'at_risk', 'patient'),
            allowNull: false
        },
        conditions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        summary: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
        order: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0
        },
        created_at: { allowNull: false, type: sequelize_1.DataTypes.DATE },
        updated_at: { allowNull: false, type: sequelize_1.DataTypes.DATE }
    });
}
async function down(queryInterface) {
    await queryInterface.dropTable('recommendation_rules');
}
