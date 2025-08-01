"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('questions', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4
        },
        category_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'question_categories',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        question_text: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
        response_type: {
            type: sequelize_1.DataTypes.ENUM('mcq', 'numeric', 'yes_no'),
            allowNull: false
        },
        options: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true
        },
        order: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0
        },
        created_at: {
            allowNull: false,
            type: sequelize_1.DataTypes.DATE
        },
        updated_at: {
            allowNull: false,
            type: sequelize_1.DataTypes.DATE
        }
    });
}
async function down(queryInterface) {
    await queryInterface.dropTable('questions');
}
