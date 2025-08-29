"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('food_items', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        variant: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        base_gi: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        macro_profile: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
        cultural_tags: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
        created_at: {
            allowNull: false,
            type: sequelize_1.DataTypes.DATE,
        },
        updated_at: {
            allowNull: false,
            type: sequelize_1.DataTypes.DATE,
        },
    });
    await queryInterface.addConstraint('food_items', {
        fields: ['name', 'variant'],
        type: 'unique',
        name: 'food_items_name_variant_unique'
    });
}
async function down(queryInterface) {
    await queryInterface.dropTable('food_items');
}
