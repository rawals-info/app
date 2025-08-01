"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('user_profiles', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4
        },
        auth_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'auths',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        first_name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        phone_number: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        date_of_birth: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: true
        },
        gender: {
            type: sequelize_1.DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
            allowNull: true
        },
        profile_image: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        address: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true
        },
        timezone: {
            type: sequelize_1.DataTypes.STRING,
            defaultValue: 'UTC'
        },
        language: {
            type: sequelize_1.DataTypes.STRING,
            defaultValue: 'en'
        },
        notification_preferences: {
            type: sequelize_1.DataTypes.JSON,
            defaultValue: {}
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
    await queryInterface.dropTable('user_profiles');
}
