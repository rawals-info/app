"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('recommendation_results', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4
        },
        user_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'user_profiles', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        rule_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: 'recommendation_rules', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        questionnaire_snapshot: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false
        },
        created_at: { allowNull: false, type: sequelize_1.DataTypes.DATE },
        updated_at: { allowNull: false, type: sequelize_1.DataTypes.DATE }
    });
}
async function down(queryInterface) {
    await queryInterface.dropTable('recommendation_results');
}
